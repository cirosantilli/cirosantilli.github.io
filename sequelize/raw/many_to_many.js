#!/usr/bin/env node

// https://cirosantilli.com/sql-example

const assert = require('assert');
const common = require('../common')
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {

// We do separate DROPs here because if one CREATE fails, we still
// want the other DROPs to run, even though one of them will fail.
// due to the table of the failed CREATE not existing.
await common.drop(sequelize, 'AnimalTag')
await common.drop(sequelize, 'Animal')
await common.drop(sequelize, 'Tag')
await Promise.all([
  `CREATE TABLE "Animal" (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE)`,
  `CREATE TABLE "Tag" (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE)`,
].map(s => sequelize.query(s)))
await sequelize.query(`
CREATE TABLE "AnimalTag" (
  "animalId" INTEGER NOT NULL,
  "tagId" INTEGER NOT NULL,
  PRIMARY KEY ("animalId", "tagId"),
  FOREIGN KEY ("animalId") REFERENCES "Animal"(id) ON DELETE CASCADE,
  FOREIGN KEY ("tagId") REFERENCES "Tag"(id) ON DELETE CASCADE
)
`)
async function reset() {
  // Any of those also clears AnimalTag due to the CASCADE.
  await sequelize.query(`DELETE FROM "Animal"`)
  await sequelize.query(`DELETE FROM "Tag"`)
  // Trying to run both concurrently often leads to deadlocks
  // on PostgreSQL due to the concurrent CASCADEs on AnimalTag.
  //await Promise.all([`Animal`, `Tag`].map(s => sequelize.query(`DELETE FROM "${s}"`)))

  // We have to first insert Animal and Tag because AnimalTag
  // depend on it.
  await Promise.all([
    `
INSERT INTO "Animal" VALUES
(0, 'dog'),
(1, 'cat'),
(2, 'hawk'),
(3, 'bee')
`,
    `
INSERT INTO "Tag" VALUES
(0, 'flying'),
(1, 'mammal'),
(2, 'vertebrate'),
(3, 'aquatic')
`,
  ].map(s => sequelize.query(s)))
  return sequelize.query(`
INSERT INTO "AnimalTag" VALUES (0, 1),
(0, 2),
(1, 1),
(1, 2),
(2, 0),
(2, 2),
(3, 0)
`)
}
await reset()

let rows, meta

// Get all animals with a given tag.
;[rows, meta] = await sequelize.query(`
SELECT
  "Animal".name AS "Animal_name"
FROM "Animal"
INNER JOIN "AnimalTag"
  ON "Animal"."id" = "AnimalTag"."animalId"
INNER JOIN "Tag"
  ON "AnimalTag"."tagId" = "Tag".id
  AND "Tag".name = 'flying'
ORDER BY "Animal".id ASC
`)
assert.strictEqual(rows[0].Animal_name, 'hawk')
assert.strictEqual(rows[1].Animal_name, 'bee')
assert.strictEqual(rows.length, 2)

// Get all tags with of a given animal.
;[rows, meta] = await sequelize.query(`
SELECT
  "Tag".name AS "Tag_name"
FROM "Tag"
INNER JOIN "AnimalTag"
  ON "Tag".id = "AnimalTag"."tagId"
INNER JOIN "Animal"
  ON "AnimalTag"."animalId" = "Animal".id
  AND "Animal".name = 'dog'
ORDER BY "Tag".id ASC
`)
assert.strictEqual(rows[0].Tag_name, 'mammal')
assert.strictEqual(rows[1].Tag_name, 'vertebrate')
assert.strictEqual(rows.length, 2)

// Get animal counts for each tag and order them in increasing order.
// Illustrates `GROUP BY`. TODO why is Tag.name allowed in the SELECT
// even though it does not appear in the GROUP BY or aggregates?
// Wasn't this supposed to fail in PostgreSQL?
//
// Ignore tags with zero animals due to INNER JOIN.
// https://dba.stackexchange.com/questions/174694/how-to-get-a-group-where-the-count-is-zero
;[rows, meta] = await sequelize.query(`
SELECT
  "Tag".name AS name,
  COUNT(*) AS count
FROM "Tag"
INNER JOIN "AnimalTag"
  ON "Tag".id = "AnimalTag"."tagId"
INNER JOIN "Animal"
  ON "AnimalTag"."animalId" = "Animal".id
GROUP BY "Tag".id
ORDER BY
  count DESC,
  "Tag".id ASC
`)
assert.strictEqual(rows[0].name, 'vertebrate')
assert.strictEqual(parseInt(rows[0].count, 10), 3)
assert.strictEqual(rows[1].name, 'flying')
assert.strictEqual(parseInt(rows[1].count, 10), 2)
assert.strictEqual(rows[2].name, 'mammal')
assert.strictEqual(parseInt(rows[2].count, 10), 2)
assert.strictEqual(rows.length, 3)

// Same as above, but also consider tags with zero animals
// due to OUTER JOIN + COUNT(column)
;[rows, meta] = await sequelize.query(`
SELECT
  "Tag".name AS name,
  COUNT("Animal".id) AS count
FROM "Tag"
LEFT OUTER JOIN "AnimalTag"
  ON "Tag".id = "AnimalTag"."tagId"
LEFT OUTER JOIN "Animal"
  ON "AnimalTag"."animalId" = "Animal".id
GROUP BY "Tag".id
ORDER BY
  count DESC,
  "Tag".id ASC
`)
assert.strictEqual(rows[0].name, 'vertebrate')
assert.strictEqual(parseInt(rows[0].count, 10), 3)
assert.strictEqual(rows[1].name, 'flying')
assert.strictEqual(parseInt(rows[1].count, 10), 2)
assert.strictEqual(rows[2].name, 'mammal')
assert.strictEqual(parseInt(rows[2].count, 10), 2)
assert.strictEqual(rows[3].name, 'aquatic')
assert.strictEqual(parseInt(rows[3].count, 10), 0)
assert.strictEqual(rows.length, 4)

// Get animal counts for each tag that has less than 3 animals.
//
// This illustrates HAVING, which is what you have to do when dealing with aggregations:
// https://stackoverflow.com/questions/9253244/sql-having-vs-where
//
// Note that we cannot use the alias "count" in the HAVING:
// we just have to write COUNT(*) again there
// * https://dba.stackexchange.com/questions/281438/why-does-an-alias-with-a-having-clause-not-exist-in-postgresql
// * https://www.postgresqltutorial.com/postgresql-having/
//   "PostgreSQL evaluates the HAVING clause after the FROM, WHERE, GROUP BY, and before the SELECT, DISTINCT, ORDER BY and LIMIT clauses"
;[rows, meta] = await sequelize.query(`
SELECT
  "Tag".name AS name,
  COUNT(*) AS count
FROM "Tag"
INNER JOIN "AnimalTag"
  ON "Tag".id = "AnimalTag"."tagId"
INNER JOIN "Animal"
  ON "AnimalTag"."animalId" = "Animal".id
GROUP BY "Tag".id
HAVING
  COUNT(*) < 3
ORDER BY
  count DESC,
  "Tag".id ASC
`)
assert.strictEqual(rows[0].name, 'flying')
assert.strictEqual(parseInt(rows[0].count, 10), 2)
assert.strictEqual(rows[1].name, 'mammal')
assert.strictEqual(parseInt(rows[1].count, 10), 2)
assert.strictEqual(rows.length, 2)

// Get animal counts only for the tags that are associated with 'dog'.
// Because SELECT must either contain aggregates or group by columns,
// we can't get names here unless:
// * we add a names to the GROUP BY. TODO wouldn't this would lead to slower evaluation, as it would have to both strings and integers, or strings rather than integers?
//   The optimizer could in principle however notice that because both names and IDs unique, that it can use the IDs for comparisons instead of names. But does it really?
// * TODO any other better possibility, either with joins or subqueries?
;[rows, meta] = await sequelize.query(`
SELECT
  COUNT(*) AS count,
  "AnimalTag2"."tagId" AS "tagId"
FROM "Animal"
INNER JOIN "AnimalTag"
  ON "Animal".name = 'dog'
  AND "Animal".id = "AnimalTag"."animalId"
INNER JOIN "Tag"
  ON "Tag".id = "AnimalTag"."tagId"
INNER JOIN "AnimalTag" AS "AnimalTag2"
  ON "AnimalTag2"."tagId" = "AnimalTag"."tagId"
GROUP BY "AnimalTag2"."tagId"
ORDER BY
  count DESC,
  "AnimalTag2"."tagId" ASC
`)
assert.strictEqual(rows[0].tagId, 2)
assert.strictEqual(parseInt(rows[0].count, 10), 3)
assert.strictEqual(rows[1].tagId, 1)
assert.strictEqual(parseInt(rows[1].count, 10), 2)
assert.strictEqual(rows.length, 2)

// Same as above but use names in the JOIN instead of IDs.
;[rows, meta] = await sequelize.query(`
SELECT
  COUNT(*) AS count,
  "Tag".name AS name
FROM "Animal"
INNER JOIN "AnimalTag"
  ON "Animal".name = 'dog'
  AND "Animal".id = "AnimalTag"."animalId"
INNER JOIN "Tag"
  ON "Tag".id = "AnimalTag"."tagId"
INNER JOIN "AnimalTag" AS "AnimalTag2"
  ON "AnimalTag2"."tagId" = "AnimalTag"."tagId"
GROUP BY "Tag".name
ORDER BY
  count DESC,
  "Tag"."name" ASC
`)
assert.strictEqual(rows[0].name, 'vertebrate')
assert.strictEqual(parseInt(rows[0].count, 10), 3)
assert.strictEqual(rows[1].name, 'mammal')
assert.strictEqual(parseInt(rows[1].count, 10), 2)
assert.strictEqual(rows.length, 2)

// Queries that modify data.

// ON DELETE CASCADE action: if we delete the 'vertebrate' tag,
// corresponding relations are also deleted.
await sequelize.query(`DELETE FROM "Tag" WHERE id = 2`)
;[rows, meta] = await sequelize.query(`
SELECT * FROM "AnimalTag"
ORDER BY "animalId" ASC, "tagId" ASC
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
await reset()

// DELETE all animals with a given tag.
// DELETE + JOIN does not appear to be in the SQL standard, and sqlite 3.35 does not support it:
// ``
// near "INNER": syntax error
// ``
// so the only way is to do it with sub queries:
// https://stackoverflow.com/questions/24511153/how-delete-table-inner-join-with-other-table-in-sqlite
// PostgreSQL does support it however:
// https://stackoverflow.com/questions/11753904/postgresql-delete-with-inner-join
if (false) {
  // JOIN version.
  await sequelize.query(`
DELETE FROM "Animal"
INNER JOIN "AnimalTag"
  ON "Animal".id = "AnimalTag"."animalId"
INNER JOIN "Tag"
  ON "AnimalTag"."tagId" = "Tag".id
  AND "Tag".name = 'flying'
ORDER BY "Animal".id ASC
`)
} else {
  // Subquery version.
  await sequelize.query(`
DELETE FROM "Animal"
WHERE "Animal".id IN (
  SELECT
    "Animal".id
  FROM "Animal"
  INNER JOIN "AnimalTag"
    ON "Animal".id = "AnimalTag"."animalId"
  INNER JOIN "Tag"
    ON "AnimalTag"."tagId" = "Tag".id
    AND "Tag".name = 'flying'
)
`)
}
;[rows, meta] = await sequelize.query(`SELECT * FROM "Animal" ORDER BY id ASC`)
assert.strictEqual(rows[0].name, 'dog')
assert.strictEqual(rows[1].name, 'cat')
assert.strictEqual(rows.length, 2)
await reset()

// Delete any tags associated with 'dog' that have less than 3 animals.
// In our specific test database, this should delete only the "mammal" tag.
// Application: with 1 instead of 3, we could use this to clean up possbly
// empty tags after deleting animal, as there might be no more associated animals
// to them after every animal deletion.
await sequelize.query(`
DELETE FROM "Tag"
WHERE "Tag".id IN (
  SELECT
    "AnimalTag2"."tagId"
  FROM "Animal"
  INNER JOIN "AnimalTag"
    ON "Animal".name = 'dog'
    AND "Animal".id = "AnimalTag"."animalId"
  INNER JOIN "Tag"
    ON "Tag".id = "AnimalTag"."tagId"
  INNER JOIN "AnimalTag" AS "AnimalTag2"
    ON "AnimalTag2"."tagId" = "AnimalTag"."tagId"
  GROUP BY "AnimalTag2"."tagId"
  HAVING
    COUNT(*) < 3
)
`)
;[rows, meta] = await sequelize.query(`SELECT * FROM "Tag" ORDER BY id ASC`)
assert.strictEqual(rows[0].name, 'flying')
assert.strictEqual(rows[1].name, 'vertebrate')
assert.strictEqual(rows[2].name, 'aquatic')
assert.strictEqual(rows.length, 3)
await reset()

await sequelize.close();
})();
