const path = require('path');

const { Sequelize } = require('sequelize');

function sequelize(filename, dialect, opts) {
  if (dialect === undefined) {
    dialect = 'l'
  }
  if (dialect === 'l') {
    return new Sequelize(Object.assign({
      dialect: 'sqlite',
      storage: path.parse(filename).name + '.sqlite'
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
