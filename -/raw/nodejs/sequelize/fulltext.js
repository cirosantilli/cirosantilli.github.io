#!/usr/bin/env node
// https://cirosantilli.com/sequelize-example
const { DataTypes, Op, Sequelize } = require('sequelize')
const common = require('./common')
const sequelize = common.sequelize(__filename, process.argv[2])
const Strings = sequelize.define('Strings', {
  mycol: { type: DataTypes.STRING },
})
async function reset() {
  await sequelize.truncate({ cascade: true })
  await Strings.create({ mycol: 'chicken elephant' })
  await Strings.create({ mycol: 'beetle rabbit' })
  await Strings.create({ mycol: 'elephant beetle' })
  if (sequelize.options.dialect === 'postgres') {
    const col = 'mycol'
    await sequelize.query(`ALTER TABLE "${Strings.tableName}" ADD COLUMN "${col}_tsvector" tsvector
GENERATED ALWAYS AS (to_tsvector('english', "${col}")) STORED`)
    await sequelize.query(`CREATE INDEX "${Strings.tableName}_${col}_gin_idx" ON "${Strings.tableName}" USING GIN ("${col}_tsvector")`)
  }
}
function sequelizePostgresqlFtsUserQueryToLiteral(q) {
  return sequelize.literal(
    `regexp_replace(plainto_tsquery('english', ${sequelize.escape(q)})::text || ':*', '^..$', '')::tsquery`
  )
}
;(async () => {
await sequelize.sync({ force: true })
await reset()
let rows
if (sequelize.options.dialect === 'postgres') {
  rows = await Strings.findAll({
    //where: { mycol_tsvector: { [Op.match]: Sequelize.fn('to_tsquery', 'beetle') } },
    where: { mycol_tsvector: { [Op.match]: Sequelize.fn('plainto_tsquery', 'beetle') } },
  })
  common.assertEqual(rows, [
    { mycol: 'beetle rabbit' },
    { mycol: 'elephant beetle' },
  ])

  // Prefix search on the last term. Does not blow up for arbitrary user input I believe.
  rows = await Strings.findAll({
    where: { mycol_tsvector: { [Op.match]: sequelizePostgresqlFtsUserQueryToLiteral('rabbit bee') } },
    order: [['mycol', 'ASC']]
  })
  common.assertEqual(rows, [
    { mycol: 'beetle rabbit' },
  ])
  // Mostly to check that these cases don't blow up due to bad to_tsquery.
  rows = await Strings.findAll({
    where: { mycol_tsvector: { [Op.match]: sequelizePostgresqlFtsUserQueryToLiteral('') } },
    order: [['mycol', 'ASC']]
  })
  common.assertEqual(rows, [])
  rows = await Strings.findAll({
    where: { mycol_tsvector: { [Op.match]: sequelizePostgresqlFtsUserQueryToLiteral(',') } },
    order: [['mycol', 'ASC']]
  })
  common.assertEqual(rows, [])
}
})().finally(() => { return sequelize.close() })
