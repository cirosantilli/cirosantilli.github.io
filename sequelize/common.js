const path = require('path');

const { Sequelize } = require('sequelize');

async function drop(sequelize, table) {
  if (sequelize.options.dialect === 'postgres') {
    // We need CASCADE because we use a single database for all runs,
    // and some tables have conflicting names across tests.
    await sequelize.query(`DROP TABLE IF EXISTS "${table}" CASCADE`)
  } else {
    await sequelize.query(`DROP TABLE IF EXISTS "${table}"`)
  }
}
exports.drop = drop

function sequelize(filename, dialect, opts) {
  if (dialect === undefined) {
    dialect = 'l'
  }
  if (dialect === 'l') {
    const pathParse = path.parse(filename)
    return new Sequelize(Object.assign({
      dialect: 'sqlite',
      storage: path.join(pathParse.dir, pathParse.name) + '.sqlite'
    }, opts));
  } else if (dialect === 'p') {
    // To use the URI syntax, we need an explcit username and password.
    // But the second constructor works with peer authentication.
    // https://stackoverflow.com/questions/46207155/sequelize-and-peer-authentication-for-postgres
    //
    // Fails:
    //
    //const sequelize = new Sequelize('postgres://user:password@localhost:5432/lkmc-nodejs')
    //
    // Works with peer authentication: Before running this:
    // * ensure that you can use peer authentication without password
    //   from the command line, i.e. `psql` works
    // * create the database for our test:
    //   ``
    //   createdb lkmc-nodejs
    return new Sequelize('tmp', undefined, undefined, Object.assign({
      dialect: 'postgres',
      host: '/var/run/postgresql',
    }, opts));
  } else {
    throw new Error('Unknown dialect')
  }
}
exports.sequelize = sequelize

// Get n sequelize instances for parallel tests.
// Each one prepends its index to every log message.
function sequelizes(n, filename, dialect, opts) {
  return Array.from(
    Array(n).keys(),
    i => sequelize(
      filename,
      dialect,
      { logging: (s) => console.log(`${i}: ${s}`) }
    )
  )
}
exports.sequelizes = sequelizes


async function transaction(sequelize, isolation, cb) {
  let done = false
  if (isolation === undefined) {
    isolation = 'SERIALIZABLE'
  }
  while (!done) {
    if (isolation !== 'NONE') {
      if (sequelize.options.dialect === 'sqlite') {
        await sequelize.query(`BEGIN TRANSACTION`)
      } else {
        await sequelize.query(`BEGIN TRANSACTION ISOLATION LEVEL ${isolation}`)
      }
    }
    try {
      await cb(sequelize)
      if (isolation !== 'NONE') {
        await sequelize.query(`COMMIT`)
      }
      done = true;
    } catch (e) {
      if (
        sequelize.options.dialect === 'postgres' &&
        // This can happen randomly, and we have to re-run the transaction:
        // - could not serialize access due to read/write dependencies among transactions
        // - could not serialize access due to concurrent update
        // https://www.postgresql.org/docs/13/errcodes-appendix.html
        e.original.code === '40001'
      ) {
        if (isolation !== 'NONE') {
          await sequelize.query(`ROLLBACK`)
          // COMMIT would also work here in PostgreSQL it seems, when it enters error state it ignores
          // everything until the transaction finishes, and the COMMIT then becomes as ROLLBACK:
          // https://stackoverflow.com/questions/27245101/why-should-we-use-rollback-in-sql-explicitly/27245234#27245234
          // but can't find any clear docs on it, this one:
          // https://stackoverflow.com/questions/48277519/how-to-use-commit-and-rollback-in-a-postgresql-function/48277708#48277708
          // points to some possible docs, but not very direct.
          // await sequelize.query(`COMMIT`)
        }
      } else {
        // Error that we don't know how to handle.
        throw e;
      }
    }
  }
}
exports.transaction = transaction
