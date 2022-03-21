#!/usr/bin/env node
// https://cirosantilli.com/sequelize-example
const assert = require('assert')
const path = require('path')
const { DataTypes } = require('sequelize')
const common = require('./common')
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {
const IntegerNames = sequelize.define('IntegerNames', {
  value: { type: DataTypes.INTEGER },
  name: { type: DataTypes.STRING },
})
await IntegerNames.sync({ force: true })
async function reset() {
  await sequelize.truncate({ cascade: true })
  await IntegerNames.create({ value: 2, name: 'two' })
  await IntegerNames.create({ value: 3, name: 'three' })
  await IntegerNames.create({ value: 5, name: 'five' })
}
await reset()
let rows
rows = await IntegerNames.findAll()
const row = rows[0]
let updatedAt, updatedAt0

// No change, no update.
updatedAt = row.updatedAt
await row.save()
assert.strictEqual(updatedAt, row.updatedAt)

// Change, update.
updatedAt = row.updatedAt
row.value = 22
await row.save()
assert(updatedAt !== row.updatedAt)

// Change with silen, no update.
updatedAt = row.updatedAt
row.value = 23
await row.save({ silent: true })
assert.strictEqual(updatedAt, row.updatedAt)

})().finally(() => { return sequelize.close() })
