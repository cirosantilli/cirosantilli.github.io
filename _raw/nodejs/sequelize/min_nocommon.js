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
    storage: 'tmp.sqlite',
  })
}
function assertEqual(rows, rowsExpect) {
  assert.strictEqual(rows.length, rowsExpect.length)
  for (let i = 0; i < rows.length; i++) {
    let row = rows[i]
    let rowExpect = rowsExpect[i]
    for (let key in rowExpect) {
      assert.strictEqual(row[key], rowExpect[key])
    }
  }
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
rows = await IntegerNames.findAll({ order: [['value', 'ASC']] })
assertEqual(rows, [
  { id: 1, value: 2, name: 'two',   },
  { id: 2, value: 3, name: 'three', },
  { id: 3, value: 5, name: 'five',  },
])
})().finally(() => { return sequelize.close() })
