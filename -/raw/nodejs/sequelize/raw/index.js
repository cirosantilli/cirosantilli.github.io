#!/usr/bin/env node
// https://cirosantilli.com/sequelize-raw-query
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
  name TEXT
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
common.assertEqual(rows, [
  { value: 2, name: 'two', },
  { value: 3, name: 'three', },
  { value: 5, name: 'five', },
])

// Use expression in order.
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY -value ASC`)
common.assertEqual(rows, [
  { value: 5, name: 'five', },
  { value: 3, name: 'three', },
  { value: 2, name: 'two', },
])

// SELECT with a WHERE condition.
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" WHERE value > 2 ORDER BY value ASC`)
common.assertEqual(rows, [
  { value: 3 },
  { value: 5 },
])

// SELECT with a WHERE IN condition.
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" WHERE value IN (3, 5) ORDER BY value ASC`)
common.assertEqual(rows, [
  { value: 3, },
  { value: 5, },
])

// Just the WHERE IN in isolation.
;[rows, meta] = await sequelize.query(`SELECT 3 IN (3, 5) AS "ret"`)
if (sequelize.options.dialect === 'postgres') {
  assert.strictEqual(rows[0].ret, true)
} else if (sequelize.options.dialect === 'sqlite') {
  assert.strictEqual(rows[0].ret, 1)
}
;[rows, meta] = await sequelize.query(`SELECT 1 IN (3, 5) AS "ret"`)
if (sequelize.options.dialect === 'postgres') {
  assert.strictEqual(rows[0].ret, false)
} else if (sequelize.options.dialect === 'sqlite') {
  assert.strictEqual(rows[0].ret, 0)
}

// NULL IN in isolation. TODO understand these results.
;[rows, meta] = await sequelize.query(`SELECT NULL IN (3, 5) AS "ret"`)
console.error(rows);
assert.strictEqual(rows[0].ret, null)
;[rows, meta] = await sequelize.query(`SELECT NULL NOT IN (3, 5) AS "ret"`)
assert.strictEqual(rows[0].ret, null)

// NULL IN in column.
await sequelize.query(`
INSERT INTO "IntegerNames" VALUES
(3, 7, NULL),
(4, 11, NULL)
`)
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" WHERE "name" IN ('three', 'five') ORDER BY "value" ASC`)
common.assertEqual(rows, [
  { value: 3, },
  { value: 5, },
])
// Very confusing, since NULL = and NULL <> is always false. So we need an explicit OR IS NULL.
// * https://stackoverflow.com/questions/9581745/sql-is-null-and-null
// * https://stackoverflow.com/questions/6362112/in-clause-with-null-or-is-null
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" WHERE "name" NOT IN ('three', 'five') ORDER BY "value" ASC`)
common.assertEqual(rows, [
  { value: 2, name: 'two', },
])
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" WHERE "name" NOT IN ('three', 'five') OR "name" IS NULL ORDER BY "value" ASC`)
common.assertEqual(rows, [
  { value: 2, name: 'two', },
  { value: 7, name: null, },
  { value: 11, name: null, },
])
await reset()

// Example of using bind to let sequelize/the database worry about proper value quoting.
// https://sequelize.org/master/manual/raw-queries.html#replacements
;[rows, meta] = await sequelize.query(
  `SELECT * FROM "IntegerNames" WHERE value = $value AND name = $name ORDER BY value ASC`,
  {
    //replacements: { value: 3 },
    bind: { value: 3, name: 'three' },
  }
)
common.assertEqual(rows, [
  { value: 3, },
])

// With replacement instead.
// https://sequelize.org/master/manual/raw-queries.html#replacements
;[rows, meta] = await sequelize.query(
  `SELECT * FROM "IntegerNames" WHERE value = :value AND name = :name ORDER BY value ASC`,
  {
    replacements: { value: 3, name: 'three' },
  }
)
common.assertEqual(rows, [
  { value: 3, },
])

// Array example with replacement.
;[rows, meta] = await sequelize.query(
  `SELECT * FROM "IntegerNames" WHERE value IN (:value) ORDER BY value ASC`,
  {
    replacements: { value: [3, 5] },
  }
)
common.assertEqual(rows, [
  { value: 3, },
  { value: 5, },
])

//// TODO array example with bind
//// https://github.com/sequelize/sequelize/issues/8140
//;[rows, meta] = await sequelize.query(
//  `SELECT * FROM "IntegerNames" WHERE value IN $value ORDER BY value ASC`,
//  {
//    bind: { value: [3, 5] },
//  }
//)
//assert.strictEqual(rows[0].value, 3)
//assert.strictEqual(rows[1].value, 5)
//assert.strictEqual(rows.length, 2)

// WHERE IN pair. VALUES thing likely makes a temporary database.
// https://stackoverflow.com/questions/10725901/select-query-by-pair-of-fields-using-an-in-clause
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" WHERE (value, name) IN (VALUES (3, 'three'), (5, 'five')) ORDER BY value ASC`)
common.assertEqual(rows, [
  { value: 3 },
  { value: 5 },
])

// SELECT LIMIT
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY value ASC LIMIT 2`)
common.assertEqual(rows, [
  { value: 2 },
  { value: 3 },
])

// SELECT LIMIT OFFSET
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY value ASC LIMIT 1 OFFSET 2`)
common.assertEqual(rows, [
  { value: 5 },
])

// OFFSET without LIMIT.
// Once again, SQL standard, why are you so worthless? Basic functionality not available.
// * https://stackoverflow.com/questions/29894645/how-to-skip-the-first-n-rows-in-sql-query/29894850
// * https://stackoverflow.com/questions/315621/mysql-how-to-select-all-rows-from-a-table-except-the-last-one
if (sequelize.options.dialect === 'postgres') {
  ;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY value ASC OFFSET 1`)
} else if (sequelize.options.dialect === 'sqlite') {
  ;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY value ASC LIMIT -1 OFFSET 1`)
}
common.assertEqual(rows, [
  { value: 3 },
  { value: 5 },
])

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
;[rows, meta] = await sequelize.query(`SELECT SUM("value") AS "sum" FROM "IntegerNames"`)
assert.strictEqual(parseInt(rows[0].sum, 10), 10)
assert.strictEqual(rows.length, 1)

// String concatenation aggregate.
if (sequelize.options.dialect === 'postgres') {
  // https://stackoverflow.com/questions/43870/how-to-concatenate-strings-of-a-string-field-in-a-postgresql-group-by-query
  ;[rows, meta] = await sequelize.query(`SELECT string_agg("name", '-' ORDER BY "value" ASC) AS "res" FROM "IntegerNames"`)
} else {
  // SQLite
  // * https://stackoverflow.com/questions/3515267/string-aggregation-in-sqlite generic:
  // * https://stackoverflow.com/questions/1897352/sqlite-group-concat-ordering ordering specific

  // The ordering may be undefined by the docs on this version:
  ;[rows, meta] = await sequelize.query(`SELECT group_concat("name", '-') AS "res" FROM "IntegerNames"`)
}
assert.strictEqual(rows[0].res, 'two-three-five')

// Find the entire rows that reaches the MAX of the aggregate query.
// We need the subquery as mentioned at:
// https://www.postgresql.org/docs/14/tutorial-agg.html
;[rows, meta] = await sequelize.query(`
SELECT * FROM "IntegerNames" where value =
  (SELECT MAX(value) FROM "IntegerNames")
`)
common.assertEqual(rows, [
  { value: 5, name: 'five' },
])
if (sequelize.options.dialect === 'sqlite') {
  // I think this is guaranteed to work as an SQLite extension.
  // https://stackoverflow.com/questions/48326957/row-with-max-value-per-group-sqlite/48328243#48328243
  ;[rows, meta] = await sequelize.query(`
SELECT *, MAX(value) FROM "IntegerNames"
`)
  common.assertEqual(rows, [
    { value: 5, name: 'five' },
  ])
}


// UPDATE one row.
await sequelize.query(`UPDATE "IntegerNames" SET value = 55 WHERE value = 5`)
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY value ASC`)
common.assertEqual(rows, [
  { value: 2, name: 'two' },
  { value: 3, name: 'three' },
  { value: 55, name: 'five' },
])
await reset()

// UPDATE multiple rows.
await sequelize.query(`UPDATE "IntegerNames" SET value = value + 1`)
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY value ASC`)
common.assertEqual(rows, [
  { value: 3, name: 'two' },
  { value: 4, name: 'three' },
  { value: 6, name: 'five' },
])
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
common.assertEqual(rows, [
  { value: 1, name: 'two' },
  { value: 3, name: 'three' },
  { value: 6, name: 'five' },
])
await reset()

// DELETE rows that match some criteria.
await sequelize.query(`DELETE FROM "IntegerNames" WHERE value > 2`)
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY value ASC`)
common.assertEqual(rows, [
  { value: 2, name: 'two' },
])
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
common.assertEqual(rows, [
  { value: 3 },
  { value: 5 },
])
await reset()

// Test without using the table.

// Minimal.
;[rows, meta] = await sequelize.query(`SELECT 1 AS "n"`)
common.assertEqual(rows, [ { n: 1 }, ])

// Multiple selects.
;[rows, meta] = await sequelize.query(`SELECT 1 AS "n"; SELECT 2 AS "n";`)
if (sequelize.options.dialect === 'postgres') {
  common.assertEqual(rows, [
    { n: 1 },
    { n: 2 },
  ])
} else {
  common.assertEqual(rows, [
    { n: 1 },
  ])
}

// Multiple result rows with WITH
;[rows, meta] = await sequelize.query(`WITH "t" ("i", "j") AS (VALUES (1, -1), (2, -2)) SELECT * FROM "t" ORDER BY "i" ASC`)
common.assertEqual(rows, [
  { i: 1, j: -1 },
  { i: 2, j: -2 }
])

// Multiple updates. So here we understand that SQLite actually
// only runs the first query if we give it multiple ones.
await sequelize.query(`UPDATE "IntegerNames" SET value = 33 WHERE value = 3;UPDATE "IntegerNames" SET value = 55 WHERE value = 5;`)
;[rows, meta] = await sequelize.query(`SELECT * FROM "IntegerNames" ORDER BY value ASC`)
if (sequelize.options.dialect === 'postgres') {
  common.assertEqual(rows, [
    { value: 2, name: 'two', },
    { value: 33, name: 'three', },
    { value: 55, name: 'five', },
  ])
} else {
  common.assertEqual(rows, [
    { value: 2, name: 'two', },
    { value: 5, name: 'five', },
    { value: 33, name: 'three', },
  ])
}
await reset()

// Add
;[rows, meta] = await sequelize.query(`SELECT 2 + 3 AS "n"`)
common.assertEqual(rows, [ { n: 5 }, ])

// Multiply
;[rows, meta] = await sequelize.query(`SELECT 2 * 3 AS "n"`)
common.assertEqual(rows, [ { n: 6 }, ])

// Subtract
;[rows, meta] = await sequelize.query(`SELECT 2 - 3 AS "n"`)
common.assertEqual(rows, [ { n: -1 }, ])

// Divide
;[rows, meta] = await sequelize.query(`SELECT 5 / 2 AS "n"`)
common.assertEqual(rows, [ { n: 2 }, ])

// String
;[rows, meta] = await sequelize.query(`SELECT 'abc' AS "n"`)
common.assertEqual(rows, [ { n: 'abc' }, ])

// String concatenation
;[rows, meta] = await sequelize.query(`SELECT 'ab' || 'cd' AS "n"`)
common.assertEqual(rows, [ { n: 'abcd' }, ])

// format
// https://www.sqlite.org/lang_corefunc.html#format
// https://www.postgresql.org/docs/14/functions-string.html
if (sequelize.options.dialect === 'sqlite') {
  ;[rows, meta] = await sequelize.query(`SELECT printf('a%04db', 13) AS "n"`)

  // Will also work from sqlite 3.38
  // https://stackoverflow.com/questions/6576343/how-to-emulate-lpad-rpad-with-sqlite/62361301#62361301
  //;[rows, meta] = await sequelize.query(`SELECT format('a%04db', 13) AS "n"`)
} else if (sequelize.options.dialect === 'postgres') {
  // PostgreSQL 14 format only supports %s no %d...
  // https://www.postgresql.org/docs/14/functions-string.html#FUNCTIONS-STRING-FORMAT
  // Pointless!
  ;[rows, meta] = await sequelize.query(`SELECT format('a%sb', lpad(cast(13 as text), 4, '0')) AS "n"`)
}
common.assertEqual(rows, [ { n: 'a0013b' }, ])

// LIKE
;[rows, meta] = await sequelize.query(`SELECT 'abcd' LIKE 'ab%' AS "n"`)
if (sequelize.options.dialect === 'postgres') {
  common.assertEqual(rows, [ { n: true }, ])
} else {
  common.assertEqual(rows, [ { n: 1 }, ])
}
;[rows, meta] = await sequelize.query(`SELECT 'abcd' LIKE 'a' AS "n"`)
if (sequelize.options.dialect === 'postgres') {
  common.assertEqual(rows, [ { n: false }, ])
} else {
  common.assertEqual(rows, [ { n: 0 }, ])
}

// REPLACE
;[rows, meta] = await sequelize.query(`SELECT REPLACE('aabbccbb', 'bb', 'B') AS "n"`)
common.assertEqual(rows, [ { n: 'aaBccB' }, ])

// LENGTH
;[rows, meta] = await sequelize.query(`SELECT LENGTH('abca') AS "n"`)
common.assertEqual(rows, [ { n: 4 }, ])

// SUBSTR(string, start, length)
;[rows, meta] = await sequelize.query(`SELECT SUBSTR('abcde', 3, 2) AS "n"`)
common.assertEqual(rows, [ { n: 'cd' }, ])
;[rows, meta] = await sequelize.query(`SELECT SUBSTR('abcde', 3) AS "n"`)
common.assertEqual(rows, [ { n: 'cde' }, ])

// Remove last n chars.

  // https://stackoverflow.com/questions/52647648/remove-last-n-chars-of-a-varchar-column/73262779#73262779

  // SUBSTR + LENGTH to remove a known suffix of length 2.
  ;[rows, meta] = await sequelize.query(`SELECT SUBSTR('abcde', 1, LENGTH('abcde') - 2) AS "n"`)
  common.assertEqual(rows, [ { n: 'abc' }, ])

  // LEFT PostgreSQL function
  if (sequelize.options.dialect === 'postgres') {
    ;[rows, meta] = await sequelize.query(`SELECT LEFT('abcde', -2) AS "n"`)
    common.assertEqual(rows, [ { n: 'abc' }, ])
  }

if (sequelize.options.dialect === 'postgres') {
  // Array data type. Quite cool.
  // https://www.postgresql.org/docs/current/arrays.html

  // Create.
  ;[rows, meta] = await sequelize.query(`SELECT ARRAY[10, 20, 30] AS "n"`)
  // Sequelize actually parses it out. Amazing.
  common.assertEqual(rows, [ { n: [10, 20, 30] } ])

  // Access. 1-based index.
  ;[rows, meta] = await sequelize.query(`SELECT (ARRAY[10, 20, 30])[1] AS "n"`)
  common.assertEqual(rows, [ { n: 10 } ])
  ;[rows, meta] = await sequelize.query(`SELECT (ARRAY[10, 20, 30])[2] AS "n"`)
  common.assertEqual(rows, [ { n: 20 } ])
  ;[rows, meta] = await sequelize.query(`SELECT (ARRAY[10, 20, 30])[3] AS "n"`)
  common.assertEqual(rows, [ { n: 30 } ])

  // Append.
  ;[rows, meta] = await sequelize.query(`SELECT array_append(ARRAY[10, 20, 30], 40) AS "n"`)
  common.assertEqual(rows, [ { n: [10, 20, 30, 40] } ])

  // Compare.
  ;[rows, meta] = await sequelize.query(`SELECT ARRAY[10, 20] < ARRAY[10, 21] AS "n"`)
  common.assertEqual(rows, [ { n: true } ])
  ;[rows, meta] = await sequelize.query(`SELECT ARRAY[10, 20] < ARRAY[10, 19] AS "n"`)
  common.assertEqual(rows, [ { n: false } ])
  ;[rows, meta] = await sequelize.query(`SELECT ARRAY[10, 20] < ARRAY[11, 19] AS "n"`)
  common.assertEqual(rows, [ { n: true } ])
}

})().finally(() => { return sequelize.close() });
