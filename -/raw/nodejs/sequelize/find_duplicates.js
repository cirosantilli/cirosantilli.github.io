#!/usr/bin/env node
// https://cirosantilli.com/sequelize-example
// https://stackoverflow.com/questions/10324107/show-all-rows-that-have-certain-columns-duplicated
const assert = require('assert')
const { DataTypes, Op } = require('sequelize')
const common = require('./common')
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {
const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  active: {
    type: DataTypes.BOOLEAN,
  },
}, {})
// We need this dummy association here.
User.hasMany(User, { as: 'duplicate', foreignKey: 'firstName', sourceKey: 'firstName', constraints: false });
await User.sync({force: true})
await User.bulkCreate([
  { id: 1, firstName: 'test0', lastName: 'test0', active: false, },
  { id: 2, firstName: 'test0', lastName: 'test0', active: true, },
  { id: 3, firstName: 'test1', lastName: 'test1', active: true, },
  { id: 4, firstName: 'test2', lastName: 'test2', active: false, },
  { id: 5, firstName: 'test2', lastName: 'test2', active: false, },
  { id: 6, firstName: 'test3', lastName: 'test3', active: true, },
])
// Since Sequelize can't handle subqueries, we can do the JOIN approach from:
// https://stackoverflow.com/questions/10324107/show-all-rows-that-have-certain-columns-duplicated/10324160#10324160
const rows = await User.findAll({
  include: {
    model: User,
    as: 'duplicate',
    on: {
      '$User.firstName$': { [Op.col]: 'duplicate.firstName' },
      '$User.lastName$': { [Op.col]: 'duplicate.lastName' },
      '$User.id$': { [Op.ne]: { [Op.col]: 'duplicate.id' } },
    },
    required: true,
    orderBy: [['id', 'ASC']],
  }
})
assert.strictEqual(rows[0].id, 1)
assert.strictEqual(rows[1].id, 2)
assert.strictEqual(rows[2].id, 4)
assert.strictEqual(rows[3].id, 5)
assert.strictEqual(rows.length, 4)

})().finally(() => { return sequelize.close() });
