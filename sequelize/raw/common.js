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
    return new Sequelize('tmp', undefined, undefined, Object.assign({
      dialect: 'postgres',
      host: '/var/run/postgresql',
    }, opts));
  } else {
    throw new Error('Unknown dialect')
  }
}
exports.sequelize = sequelize
