const path = require('path');

const { Sequelize } = require('sequelize');

function sequelize(filename) {
  if (process.argv[2] === 'p') {
    return new Sequelize('tmp', undefined, undefined, {
      dialect: 'postgres',
      host: '/var/run/postgresql',
    });
  } else {
    return new Sequelize({
      dialect: 'sqlite',
      storage: path.parse(filename).name + '.sqlite'
    });
  }
}
exports.sequelize = sequelize
