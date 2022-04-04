#!/usr/bin/env node
// https://cirosantilli.com/upsert
const common = require('../common')
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {

// Create tables and data.
await common.drop(sequelize, `Integer`)
let autoincrement
if (sequelize.options.dialect === 'sqlite') {
  autoincrement = 'INTEGER PRIMARY KEY AUTOINCREMENT'
} else {
  autoincrement = 'SERIAL PRIMARY KEY'
}
await sequelize.query(`
CREATE TABLE "Integer" (
  id ${autoincrement},
  value INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  inverse INTEGER
)
`)
async function reset() {
  await sequelize.query(`DELETE FROM "Integer"`)
  return sequelize.query(`
INSERT INTO "Integer" ("value", "name", "inverse") VALUES
(2, 'two',   -2),
(3, 'three', -3),
(5, 'five',  -5)
`)
}
await reset()

let rows, meta

// Initial state.
;[rows, meta] = await sequelize.query(`SELECT * FROM "Integer" ORDER BY value ASC`)
common.assertEqual(rows, [
  { id: 1, value: 2, name: 'two',   inverse: -2 },
  { id: 2, value: 3, name: 'three', inverse: -3 },
  { id: 3, value: 5, name: 'five',  inverse: -5 },
])

if (sequelize.options.dialect !== 'sqlite') {
  // Update.
  // Doesn't work on sqlite3 node.js package latest version 5.0.2,
  // which seems to prepack sqlite3 3.32. / But does work when running
  // the query manually on Ubuntu 21.10, which has SQLite 3.35 (version
  // in which RETURNING was implemented).
  ;[rows, meta] = await sequelize.query(
  `INSERT INTO "Integer" ("value", "name") VALUES
(2,'TWO'),
(3,'THREE'),
(7,'SEVEN')
ON CONFLICT ("value") DO UPDATE SET "name"=EXCLUDED."name"
RETURNING "id", "value", "name", "inverse"
`)
  common.assertEqual(rows, [
    { id: 1, value: 2, name: 'TWO',    inverse: -2 },
    { id: 2, value: 3, name: 'THREE',  inverse: -3 },
    { id: 6, value: 7, name: 'SEVEN',  inverse: null },
  ])

  // Final state.
  ;[rows, meta] = await sequelize.query(`SELECT * FROM "Integer" ORDER BY value ASC`)
  common.assertEqual(rows, [
    { id: 1, value: 2, name: 'TWO',    inverse: -2 },
    { id: 2, value: 3, name: 'THREE',  inverse: -3 },
    { id: 3, value: 5, name: 'five',   inverse: -5 },
    { id: 6, value: 7, name: 'SEVEN',  inverse: null },
  ])
}

})().finally(() => { return sequelize.close() });
