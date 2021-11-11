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
