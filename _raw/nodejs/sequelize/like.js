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
await sequelize.sync({ force: true })
async function reset() {
  await sequelize.truncate({ cascade: true })
  await IntegerNames.create({ value: 2, name: 'two' })
  await IntegerNames.create({ value: 3, name: 'three' })
  await IntegerNames.create({ value: 5, name: 'five' })
}
await reset()
let rows
rows = await IntegerNames.findAll({
  order: [['value', 'ASC']],
  where: { name: { [sequelize.Sequelize.Op.like]: `t%` } },
})
common.assertEqual(rows, [
  { value: 2, name: 'two',   },
  { value: 3, name: 'three', },
])
})().finally(() => { return sequelize.close() })
