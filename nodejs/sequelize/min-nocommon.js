#!/usr/bin/env node
const assert = require('assert')
const path = require('path')
const { DataTypes, Sequelize } = require('sequelize')
let sequelize
if (process.argv[2] === 'p') {
  sequelize = new Sequelize('tmp', undefined, undefined, {
    dialect: 'postgres',
    host: '/var/run/postgresql',
  })
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'tmp.sqlite'
  })
}
;(async () => {
const IntegerNames = sequelize.define('IntegerNames', {
  value: { type: DataTypes.INTEGER },
  name: { type: DataTypes.STRING },
});
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
assert.strictEqual(rows[0].id, 1)
assert.strictEqual(rows[0].name, 'two')
assert.strictEqual(rows[0].value, 2)
assert.strictEqual(rows[1].id, 2)
assert.strictEqual(rows[1].name, 'three')
assert.strictEqual(rows[1].value, 3)
assert.strictEqual(rows[2].id, 3)
assert.strictEqual(rows[2].name, 'five')
assert.strictEqual(rows[2].value, 5)
assert.strictEqual(rows.length, 3)
})().finally(() => { return sequelize.close() })
