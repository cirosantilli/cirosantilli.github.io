#!/usr/bin/env node
// https://cirosantilli.com/sql-example
const assert = require('assert');
const { DataTypes, Op } = require('sequelize');
const common = require('../common')
const sequelize = common.sequelize(__filename)
;(async () => {

// Create tables and data.
await common.drop(sequelize, `AnimalTag`)
// This would normally be done with many to many since tagid and tagName are redundant.
// We are doing it like this just to illustrate a post JOIN table state.
await sequelize.query(`
CREATE TABLE "AnimalTag" (
  "animalName" TEXT NOT NULL,
  "tagId" INTEGER NOT NULL,
  "tagName" TEXT NOT NULL
)
`)
async function reset() {
  await sequelize.query(`DELETE FROM "AnimalTag"`)
  return sequelize.query(`
INSERT INTO "AnimalTag" VALUES
('dog', 0, 'mammal'),
('bat', 0, 'mammal'),
('bat', 1, 'flying')
`)
}
await reset()

let rows, meta

// Select all.
;[rows, meta] = await sequelize.query(`
SELECT
  "tagName",
  COUNT(*) AS count
FROM "AnimalTag"
GROUP BY "tagId"
ORDER BY "tagName" ASC
`)
assert.strictEqual(rows[0].tagName, 'flying')
assert.strictEqual(rows[1].tagName, 'mammal')
assert.strictEqual(rows.length, 2)

await sequelize.close();
})();
