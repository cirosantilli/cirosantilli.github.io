#!/usr/bin/env node
// https://cirosantilli.com/sequelize-example
const assert = require('assert')
const { DataTypes, Op } = require('sequelize')
const common = require('./common')
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {
// Datetime. Automatically converts to/from date objects.
const IntegerNames = sequelize.define('IntegerNames', {
  value: {
    type: DataTypes.INTEGER,
    validate: {
      isIn: [[1, 2]]
    },
  },
  name: {
    type: DataTypes.STRING,
  },
});
await IntegerNames.sync({force: true})
await IntegerNames.create({value: 1, name: 'one'})
await IntegerNames.create({value: 2, name: 'two'})
let err
try {
  await IntegerNames.create({value: 3, name: 'three'})
} catch(e) {
  err = e
}
assert(err instanceof sequelize.Sequelize.ValidationError)
})().finally(() => { return sequelize.close() })
