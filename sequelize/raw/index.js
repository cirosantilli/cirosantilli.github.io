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
  value INTEGER NOT NULL,
  name TEXT NOT NULL,
  PRIMARY KEY(value)
)
`)
await sequelize.query(`INSERT INTO IntegerNames VALUES (2, 'two')`)
await sequelize.query(`INSERT INTO IntegerNames VALUES (3, 'three')`)
await sequelize.query(`INSERT INTO IntegerNames VALUES (5, 'five')`)

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

await sequelize.close();
})();
