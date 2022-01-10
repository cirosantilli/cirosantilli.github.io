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

// SELECT all.
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY value ASC`)
assert.strictEqual(rows[0].value, 2)
assert.strictEqual(rows[0].name, 'two')
assert.strictEqual(rows[1].value, 3)
assert.strictEqual(rows[1].name, 'three')
assert.strictEqual(rows[2].value, 5)
assert.strictEqual(rows[2].name, 'five')
assert.strictEqual(rows.length, 3)

// SELECT with a WHERE condition.
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" WHERE value > 2 ORDER BY value ASC`)
assert.strictEqual(rows[0].value, 3)
assert.strictEqual(rows[1].value, 5)
assert.strictEqual(rows.length, 2)

// SELECT with a WHERE IN condition.
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" WHERE value IN (3, 5) ORDER BY value ASC`)
assert.strictEqual(rows[0].value, 3)
assert.strictEqual(rows[1].value, 5)
assert.strictEqual(rows.length, 2)

// WHERE IN pair. VALUES thing likely makes a temporary database.
// https://stackoverflow.com/questions/10725901/select-query-by-pair-of-fields-using-an-in-clause
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" WHERE (value, name) IN (VALUES (3, 'three'), (5, 'five')) ORDER BY value ASC`)
assert.strictEqual(rows[0].value, 3)
assert.strictEqual(rows[1].value, 5)
assert.strictEqual(rows.length, 2)

// SELECT LIMIT
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY value ASC LIMIT 2`)
assert.strictEqual(rows[0].value, 2)
assert.strictEqual(rows[1].value, 3)
assert.strictEqual(rows.length, 2)

// SELECT LIMIT OFFSET
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY value ASC LIMIT 1 OFFSET 2`)
assert.strictEqual(rows[0].value, 5)
assert.strictEqual(rows.length, 1)

// OFFSET without LIMIT.
// Once again, SQL standard, why are you so worthless? Basic functionality not available.
// * https://stackoverflow.com/questions/29894645/how-to-skip-the-first-n-rows-in-sql-query/29894850
// * https://stackoverflow.com/questions/315621/mysql-how-to-select-all-rows-from-a-table-except-the-last-one
if (sequelize.options.dialect === 'postgres') {
  ;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY value ASC OFFSET 1`)
} else if (sequelize.options.dialect === 'sqlite') {
  ;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY value ASC LIMIT -1 OFFSET 1`)
}
assert.strictEqual(rows[0].value, 3)
assert.strictEqual(rows[1].value, 5)
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

// UPDATE CASE WHEN
// https://stackoverflow.com/questions/15766102/i-want-to-use-case-statement-to-update-some-records-in-sql-server-2005
// https://stackoverflow.com/questions/6097815/using-a-conditional-update-statement-in-sql
await sequelize.query(`
UPDATE "IntegerNames"
SET value = CASE
  WHEN value < 3 THEN value - 1
  WHEN value = 3 THEN value
  ELSE value + 1 END
`)
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY value ASC`)
assert.strictEqual(rows[0].value, 1)
assert.strictEqual(rows[0].name, 'two')
assert.strictEqual(rows[1].value, 3)
assert.strictEqual(rows[1].name, 'three')
assert.strictEqual(rows[2].value, 6)
assert.strictEqual(rows[2].name, 'five')
assert.strictEqual(rows.length, 3)
await reset()

// DELETE rows that match some criteria.
await sequelize.query(`DELETE FROM "IntegerNames" WHERE value > 2`)
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY value ASC`)
assert.strictEqual(rows[0].value, 2)
assert.strictEqual(rows[0].name, 'two')
assert.strictEqual(rows.length, 1)
await reset()

// DELETE LIMIT.
// Why do they make the DELETE statment so limited in the SQL standard?
// MySQL and SQLite implement it as an extension, and but PostgreSQL doesn't.
// * https://www.sqlite.org/draft/lang_delete.html "Optional LIMIT and ORDER BY clauses"
// * https://stackoverflow.com/questions/5170546/how-do-i-delete-a-fixed-number-of-rows-with-sorting-in-postgresql
// * https://www.postgresql.org/message-id/425496CE.5070400@interspire.com
await sequelize.query(`DELETE FROM "IntegerNames" WHERE id IN
  ( SELECT id FROM "IntegerNames" ORDER BY value ASC LIMIT 1 )`)
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY value ASC`)
assert.strictEqual(rows[0].value, 3)
assert.strictEqual(rows[1].value, 5)
assert.strictEqual(rows.length, 2)
await reset()

})().finally(() => { return sequelize.close() });
