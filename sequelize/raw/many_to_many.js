#!/usr/bin/env node

// https://cirosantilli.com/sql-example

const assert = require('assert');
const path = require('path');
const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = new Sequelize({ dialect: 'sqlite', storage: ':memory:' });
(async () => {

// Create tables and data.
await Promise.all([
  `CREATE TABLE Animal (id INTEGER PRIMARY KEY, name TEXT NOT NULL)`,
  `CREATE TABLE Tag (id INTEGER PRIMARY KEY, name TEXT NOT NULL)`,
  `
CREATE TABLE AnimalTag (
  animalId INTEGER NOT NULL,
  tagId INTEGER NOT NULL,
  PRIMARY KEY (animalId, tagId),
  FOREIGN KEY (animalId) REFERENCES Animal(id) ON DELETE CASCADE,
  FOREIGN KEY (tagId) REFERENCES Tag(id) ON DELETE CASCADE
)
`,
].map(s => sequelize.query(s)))
await Promise.all([
  `INSERT INTO Animal VALUES (0, 'dog')`,
  `INSERT INTO Animal VALUES (1, 'cat')`,
  `INSERT INTO Animal VALUES (2, 'hawk')`,
  `INSERT INTO Animal VALUES (3, 'bee')`,
  `INSERT INTO Tag VALUES (0, 'flying')`,
  `INSERT INTO Tag VALUES (1, 'mammal')`,
  `INSERT INTO Tag VALUES (2, 'vertebrate')`,
  `INSERT INTO AnimalTag VALUES (0, 1)`,
  `INSERT INTO AnimalTag VALUES (0, 2)`,
  `INSERT INTO AnimalTag VALUES (1, 1)`,
  `INSERT INTO AnimalTag VALUES (1, 2)`,
  `INSERT INTO AnimalTag VALUES (2, 0)`,
  `INSERT INTO AnimalTag VALUES (2, 2)`,
  `INSERT INTO AnimalTag VALUES (3, 0)`,
].map(s => sequelize.query(s)))

let rows, meta

// Get all animals with a given tag.
;[rows, meta] = await sequelize.query(`
SELECT
  Animal.name AS 'Animal_name'
FROM Animal
INNER JOIN AnimalTag
  ON Animal.id = AnimalTag.animalId
INNER JOIN Tag
  ON AnimalTag.tagId = Tag.id
  AND Tag.name = 'flying'
ORDER BY Animal.id ASC
`)
assert.strictEqual(rows[0].Animal_name, 'hawk')
assert.strictEqual(rows[1].Animal_name, 'bee')
assert.strictEqual(rows.length, 2)

// Get all tags with of a given animal.
;[rows, meta] = await sequelize.query(`
SELECT
  Tag.name AS 'Tag_name'
FROM Tag
INNER JOIN AnimalTag
  ON Tag.id = AnimalTag.tagId
INNER JOIN Animal
  ON AnimalTag.animalId = Animal.id
  AND Animal.name = 'dog'
ORDER BY Tag.id ASC
`)
assert.strictEqual(rows[0].Tag_name, 'mammal')
assert.strictEqual(rows[1].Tag_name, 'vertebrate')
assert.strictEqual(rows.length, 2)

// Get animal counts for each tag and order them in increasing order.
// Illustrates `GROUP BY`.
;[rows, meta] = await sequelize.query(`
SELECT
  Tag.name AS name,
  COUNT(*) AS count
FROM Tag
INNER JOIN AnimalTag
  ON Tag.id = AnimalTag.tagId
INNER JOIN Animal
  ON AnimalTag.animalId = Animal.id
GROUP BY Tag.id
ORDER BY
  count DESC,
  Tag.id ASC
`)
assert.strictEqual(rows[0].name, 'vertebrate')
assert.strictEqual(rows[0].count, 3)
assert.strictEqual(rows[1].name, 'flying')
assert.strictEqual(rows[1].count, 2)
assert.strictEqual(rows[2].name, 'mammal')
assert.strictEqual(rows[2].count, 2)
assert.strictEqual(rows.length, 3)

// Get animal counts only for the tags that are associated with 'dog'.
;[rows, meta] = await sequelize.query(`
SELECT
  COUNT(*) as 'count',
  Tag.name as 'name'
FROM Animal
INNER JOIN AnimalTag
  ON Animal.name = 'dog'
  AND Animal.id = AnimalTag.animalId
INNER JOIN Tag
  ON Tag.id = AnimalTag.tagId
INNER JOIN AnimalTag as 'AnimalTag2'
  ON AnimalTag2.tagId = AnimalTag.tagId
GROUP BY AnimalTag2.tagId
ORDER BY
  count DESC,
  Tag.id ASC
`)
assert.strictEqual(rows[0].name, 'vertebrate')
assert.strictEqual(rows[0].count, 3)
assert.strictEqual(rows[1].name, 'mammal')
assert.strictEqual(rows[1].count, 2)
assert.strictEqual(rows.length, 2)

// ON DELETE CASCADE action: if we delete the 'vertebrate' tag,
// corresponding relations are also deleted.
await sequelize.query(`DELETE FROM Tag WHERE id = 2`)
;[rows, meta] = await sequelize.query(`
SELECT * FROM AnimalTag
ORDER BY animalId ASC, tagId ASC
`)
assert.strictEqual(rows[0].animalId, 0)
assert.strictEqual(rows[0].tagId,    1)
assert.strictEqual(rows[1].animalId, 1)
assert.strictEqual(rows[1].tagId,    1)
assert.strictEqual(rows[2].animalId, 2)
assert.strictEqual(rows[2].tagId,    0)
assert.strictEqual(rows[3].animalId, 3)
assert.strictEqual(rows[3].tagId,    0)
assert.strictEqual(rows.length, 4)
// Undo.
await sequelize.query(`INSERT INTO Tag VALUES (2, 'vertebrate')`)
await sequelize.query(`INSERT INTO AnimalTag VALUES (0, 2)`)
await sequelize.query(`INSERT INTO AnimalTag VALUES (1, 2)`)
await sequelize.query(`INSERT INTO AnimalTag VALUES (2, 2)`)

await sequelize.close();
})();
