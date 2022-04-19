#!/usr/bin/env node
// https://cirosantilli.com/sql-example
const { DataTypes, Op } = require('sequelize');
const common = require('../common')
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {

// Create tables and data.
await common.drop(sequelize, `MyTable`)
// This would normally be done with many to many since tagid and tagName are redundant.
// We are doing it like this just to illustrate a post JOIN table state.
await sequelize.query(`
CREATE TABLE "MyTable" (
  "a" INTEGER PRIMARY KEY,
  "b" INTEGER UNIQUE NOT NULL,
  "c" INTEGER
)
`)
async function reset() {
  await sequelize.query(`DELETE FROM "MyTable"`)
  return sequelize.query(`
INSERT INTO "MyTable" VALUES
(0, 10, 20),
(1, 11, 20),
(2, 12, 21)
`)
}
await reset()
let rows, meta

// PostgreSQL 13.5 OK, select extra columns when grouping by PK.
;[rows, meta] = await sequelize.query(`
SELECT
  "b", "c"
FROM "MyTable"
GROUP BY "a"
ORDER BY "b" ASC, "c" ASC
`)
common.assertEqual(rows, [
  { b: 10, c: 20 },
  { b: 11, c: 20 },
  { b: 12, c: 21 },
])

// PostgreSQL 13.5 fail but is TODO they would like for it to work:
// select extra columns when grouping by UNIQUE NOT NULL
// https://github.com/postgres/postgres/blob/REL_13_5/src/test/regress/sql/functional_deps.sql#L27
if (sequelize.options.dialect === 'sqlite') {
  rows, meta
  ;[rows, meta] = await sequelize.query(`
SELECT
  "a", "c"
FROM "MyTable"
GROUP BY "b"
ORDER BY "a" ASC, "c" ASC
`)
  common.assertEqual(rows, [
    { a: 0, c: 20 },
    { a: 1, c: 20 },
    { a: 2, c: 21 },
  ])
}

// OK, this one just fails on PostgreSQL, and it is easy to understand why.
if (false) {
rows, meta
;[rows, meta] = await sequelize.query(`
SELECT
  "a", "b"
FROM "MyTable"
GROUP BY "c"
ORDER BY "b" ASC, "c" ASC
`)
}

await sequelize.close();
})();
