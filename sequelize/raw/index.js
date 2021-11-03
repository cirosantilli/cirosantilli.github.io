#!/usr/bin/env node
// https://cirosantilli.com/sequelize
const assert = require('assert');
const path = require('path');
const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = new Sequelize({ dialect: 'sqlite', storage: ':memory:' });
(async () => {

// Create tables and data.
await sequelize.query(`
CREATE TABLE IntegerNames (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  value INTEGER NOT NULL,
  name TEXT NOT NULL
)
`)
await Promise.all([
  `INSERT INTO IntegerNames VALUES (NULL, 2, 'two')`,
  `INSERT INTO IntegerNames VALUES (NULL, 3, 'three')`,
  `INSERT INTO IntegerNames VALUES (NULL, 5, 'five')`,
].map(s => sequelize.query(s)))

let rows, meta

// Select all.
;[rows, meta] = await sequelize.query(`SELECT * FROM IntegerNames ORDER BY value ASC`)
assert.strictEqual(rows[0].value, 2)
assert.strictEqual(rows[0].name, 'two')
assert.strictEqual(rows[1].value, 3)
assert.strictEqual(rows[1].name, 'three')
assert.strictEqual(rows[2].value, 5)
assert.strictEqual(rows[2].name, 'five')
assert.strictEqual(rows.length, 3)

// Select with a WHERE condition.
;[rows, meta] = await sequelize.query(`SELECT * FROM IntegerNames WHERE value > 2 ORDER BY value ASC`)
assert.strictEqual(rows[0].value, 3)
assert.strictEqual(rows[0].name, 'three')
assert.strictEqual(rows[1].value, 5)
assert.strictEqual(rows[1].name, 'five')
assert.strictEqual(rows.length, 2)

// COUNT and rename.
;[rows, meta] = await sequelize.query(`
SELECT COUNT(*) AS count
FROM IntegerNames
WHERE value > 2
`)
assert.strictEqual(rows[0].count, 2)
assert.strictEqual(rows.length, 1)

// SUM aggregate.
;[rows, meta] = await sequelize.query(`SELECT SUM(value) as 'sum' FROM IntegerNames`)
assert.strictEqual(rows[0].sum, 10)
assert.strictEqual(rows.length, 1)

// UPDATE one row.
await sequelize.query(`UPDATE IntegerNames SET value = 55 WHERE value = 5`)
;[rows, meta] = await sequelize.query(`SELECT * FROM IntegerNames ORDER BY value ASC`)
assert.strictEqual(rows[0].value, 2)
assert.strictEqual(rows[0].name, 'two')
assert.strictEqual(rows[1].value, 3)
assert.strictEqual(rows[1].name, 'three')
assert.strictEqual(rows[2].value, 55)
assert.strictEqual(rows[2].name, 'five')
assert.strictEqual(rows.length, 3)
// Undo.
await sequelize.query(`UPDATE IntegerNames SET value = 5 WHERE value = 55`)

// UPDATE multiple rows.
await sequelize.query(`UPDATE IntegerNames SET value = value + 1`)
;[rows, meta] = await sequelize.query(`SELECT * FROM IntegerNames ORDER BY value ASC`)
assert.strictEqual(rows[0].value, 3)
assert.strictEqual(rows[0].name, 'two')
assert.strictEqual(rows[1].value, 4)
assert.strictEqual(rows[1].name, 'three')
assert.strictEqual(rows[2].value, 6)
assert.strictEqual(rows[2].name, 'five')
assert.strictEqual(rows.length, 3)
// Undo.
await sequelize.query(`UPDATE IntegerNames SET value = value - 1`)

// DELETE a row.
await sequelize.query(`DELETE FROM IntegerNames WHERE value > 2`)
;[rows, meta] = await sequelize.query(`SELECT * FROM IntegerNames ORDER BY value ASC`)
assert.strictEqual(rows[0].value, 2)
assert.strictEqual(rows[0].name, 'two')
assert.strictEqual(rows.length, 1)
// Undo.
await sequelize.query(`INSERT INTO IntegerNames VALUES (NULL, 3, 'three')`)
await sequelize.query(`INSERT INTO IntegerNames VALUES (NULL, 5, 'five')`)

await sequelize.close();
})();
