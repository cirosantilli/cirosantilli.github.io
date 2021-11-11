#!/usr/bin/env node
// https://cirosantilli.com/sequelize
// https://cirosantilli.com/sql-example
const assert = require('assert')
const common = require('../common')
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {

// Create tables and data.
await common.drop(sequelize, `IntegerNames`)
await sequelize.query(`
CREATE TABLE "IntegerNames" (
  id INTEGER PRIMARY KEY,
  value INTEGER NOT NULL,
  name TEXT NOT NULL
)
`)
await sequelize.query(`CREATE INDEX "valueIdx" ON "IntegerNames" (value)`)
async function reset() {
  await sequelize.query(`DELETE FROM "IntegerNames"`)
  return sequelize.query(`
INSERT INTO "IntegerNames" VALUES
(0, 2, 'two'),
(1, 3, 'three'),
(2, 5, 'five')
`)
}
await reset()

let rows, meta

// Select all.
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY value ASC`)
assert.strictEqual(rows[0].value, 2)
assert.strictEqual(rows[0].name, 'two')
assert.strictEqual(rows[1].value, 3)
assert.strictEqual(rows[1].name, 'three')
assert.strictEqual(rows[2].value, 5)
assert.strictEqual(rows[2].name, 'five')
assert.strictEqual(rows.length, 3)

// Select with a WHERE condition.
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" WHERE value > 2 ORDER BY value ASC`)
assert.strictEqual(rows[0].value, 3)
assert.strictEqual(rows[0].name, 'three')
assert.strictEqual(rows[1].value, 5)
assert.strictEqual(rows[1].name, 'five')
assert.strictEqual(rows.length, 2)

// COUNT and rename.
;[rows, meta] = await sequelize.query(`
SELECT COUNT(*) AS count
FROM "IntegerNames"
WHERE value > 2
`)
// PostgreSQL returns BIGINT, which is not widely available, so gets treated as a string. Thus we convert to integer ourselves.
// https://stackoverflow.com/questions/47843370/postgres-sequelize-raw-query-to-get-count-returns-string-value
assert.strictEqual(parseInt(rows[0].count, 10), 2)
assert.strictEqual(rows.length, 1)

// SUM aggregate query.
;[rows, meta] = await sequelize.query(`SELECT SUM(value) AS "sum" FROM "IntegerNames"`)
assert.strictEqual(parseInt(rows[0].sum, 10), 10)
assert.strictEqual(rows.length, 1)

// Find the entire rows that reaches the MAX of the aggregate query.
// We need the subquery as mentioned at:
// https://www.postgresql.org/docs/14/tutorial-agg.html
;[rows, meta] = await sequelize.query(`
SELECT * FROM "IntegerNames" where value =
  (SELECT MAX(value) FROM "IntegerNames")
`)
assert.strictEqual(rows[0].value, 5)
assert.strictEqual(rows[0].name, 'five')
assert.strictEqual(rows.length, 1)

// UPDATE one row.
await sequelize.query(`UPDATE "IntegerNames" SET value = 55 WHERE value = 5`)
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY value ASC`)
assert.strictEqual(rows[0].value, 2)
assert.strictEqual(rows[0].name, 'two')
assert.strictEqual(rows[1].value, 3)
assert.strictEqual(rows[1].name, 'three')
assert.strictEqual(rows[2].value, 55)
assert.strictEqual(rows[2].name, 'five')
assert.strictEqual(rows.length, 3)
await reset()

// UPDATE multiple rows.
await sequelize.query(`UPDATE "IntegerNames" SET value = value + 1`)
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY value ASC`)
assert.strictEqual(rows[0].value, 3)
assert.strictEqual(rows[0].name, 'two')
assert.strictEqual(rows[1].value, 4)
assert.strictEqual(rows[1].name, 'three')
assert.strictEqual(rows[2].value, 6)
assert.strictEqual(rows[2].name, 'five')
assert.strictEqual(rows.length, 3)
await reset()

// DELETE a row.
await sequelize.query(`DELETE FROM "IntegerNames" WHERE value > 2`)
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY value ASC`)
assert.strictEqual(rows[0].value, 2)
assert.strictEqual(rows[0].name, 'two')
assert.strictEqual(rows.length, 1)
await reset()

})().finally(() => { return sequelize.close() });
