#!/usr/bin/env node
// https://cirosantilli.com/sequelize-example
const { DataTypes } = require('sequelize')
const common = require('./common')
const sequelize = common.sequelize(__filename, process.argv[2])
const IntegerNames = sequelize.define('IntegerNames', {
  value: { type: DataTypes.INTEGER },
  name: { type: DataTypes.STRING },
})
async function reset() {
  await sequelize.truncate({ cascade: true })
  await IntegerNames.create({ value: 2, name: 'two' })
  await IntegerNames.create({ value: 3, name: 'three' })
  await IntegerNames.create({ value: 5, name: 'five' })
}
;(async () => {
await sequelize.sync({ force: true })
await reset()
let rows
rows = await IntegerNames.findAll({ order: [['value', 'ASC']] })
common.assertEqual(rows, [
  { value: 2, name: 'two',   },
  { value: 3, name: 'three', },
  { value: 5, name: 'five',  },
])
})().finally(() => { return sequelize.close() })
