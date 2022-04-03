#!/usr/bin/env node
// https://cirosantilli.com/upsert
const common = require('../common')
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {

// Create tables and data.
await common.drop(sequelize, `Integer`)
await sequelize.query(`
CREATE TABLE "Integer" (
  id INTEGER PRIMARY KEY,
  value INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  inverse INTEGER NOT NULL
)
`)
await sequelize.query(`CREATE INDEX "valueIdx" ON "Integer" (value)`)
async function reset() {
  await sequelize.query(`DELETE FROM "Integer"`)
  return sequelize.query(`
INSERT INTO "Integer" VALUES
(1, 2, 'two', -2),
(2, 3, 'three', -3),
(3, 5, 'five', -5)
`)
}
await reset()

let rows, meta

// SELECT all.
;[rows, meta] = await sequelize.query(`SELECT * FROM "Integer" ORDER BY value ASC`)
common.assertEqual(rows, [
  { id: 1, value: 2, name: 'two',   inverse: -2 },
  { id: 2, value: 3, name: 'three', inverse: -3 },
  { id: 3, value: 5, name: 'five',  inverse: -5 },
])
;[rows, meta] = await sequelize.query(`INSERT INTO SELECT * FROM "Integer" ORDER BY value ASC`)

const ret = await Integer.bulkCreate(
  [
    {value: 2, name: 'TWO'},
    {value: 3, name: 'THREE'},
    {value: 7, name: 'SEVEN'},
  ],
  { updateOnDuplicate: ["name"] }
)

})().finally(() => { return sequelize.close() });
