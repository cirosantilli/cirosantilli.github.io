#!/usr/bin/env node
// https://cirosantilli.com/sequelize-example
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
common.assertEqual(rows, [
  { id: 1, value: 2, name: 'two',   },
  { id: 2, value: 3, name: 'three', },
  { id: 3, value: 5, name: 'five',  },
])
})().finally(() => { return sequelize.close() })
