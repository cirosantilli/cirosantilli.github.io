#!/usr/bin/env node
// https://cirosantilli.com/sql-tree-traversal
const assert = require('assert')
const common = require('../common')
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {

// Create tables and data.
await common.drop(sequelize, 'ParentIndexTree')
// Represent a tree with:
// * pointer to parent
// * index of child within parent
await sequelize.query(`
CREATE TABLE "ParentIndexTree" (
  "id" INTEGER PRIMARY KEY,
  "parentId" INTEGER,
  "childIndex" INTEGER NOT NULL,
  "value" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  FOREIGN KEY ("parentId") REFERENCES "ParentIndexTree"(id)
)
`)
await sequelize.query(`CREATE INDEX "valueIndex" ON "ParentIndexTree" (value)`)
async function reset() {
  await sequelize.query(`DELETE FROM "ParentIndexTree"`)
  //     1
  //    / \
  //   2   3
  //  / \
  // 4   5
  return sequelize.query(`
INSERT INTO "ParentIndexTree" VALUES
(3, NULL, 0, 1, 'one'  ),
(1, 3,    0, 2, 'two'  ),
(2, 3,    1, 3, 'three'),
(0, 1,    0, 4, 'four' ),
(4, 1,    1, 5, 'five' )
`)
}
await reset()

let rows, meta

// Sanity test.
;[rows, meta] = await sequelize.query(`SELECT * FROM "ParentIndexTree" ORDER BY value ASC`)
common.assertEqual(rows, [
  { value: 1, name: 'one',   },
  { value: 2, name: 'two',   },
  { value: 3, name: 'three', },
  { value: 4, name: 'four',  },
  { value: 5, name: 'five',  },
])

// "Breadth-first" sorting with an extra level argument.
// This version is not a strict breadth-first as we are not ensuring that nodes within a single level are always transversed left ot right.
// It is "breadth-first" only in the weak sense that each level is visited in before the next order.
// This is manifested by us sorting by parentId at:
// ``
// ORDER BY "level", "parentId", "childIndex"
// ``
// This final sorting by `parentId` is done only to have a deterministic output as we don't have anything better to use.
// https://stackoverflow.com/questions/192220/what-is-the-most-efficient-elegant-way-to-parse-a-flat-table-into-a-tree/22376973#22376973
;[rows, meta] = await sequelize.query(`
WITH RECURSIVE "TreeSearch" (
  "id",
  "parentId",
  "childIndex",
  "value",
  "name",
  "level"
) AS (
  SELECT
    "id",
    "parentId",
    "childIndex",
    "value",
    "name",
    0
  FROM "ParentIndexTree"
  WHERE "parentId" IS NULL

  UNION ALL

  SELECT
    "child"."id",
    "child"."parentId",
    "child"."childIndex",
    "child"."value",
    "child"."name",
    "parent"."level" + 1
  FROM "ParentIndexTree" AS "child"
  JOIN "TreeSearch" AS "parent"
    ON "child"."parentId" = "parent"."id"
)
SELECT * FROM "TreeSearch"
ORDER BY "level", "parentId", "childIndex"
`)
common.assertEqual(rows, [
  { value: 1, level: 0 },
  { value: 2, level: 1 },
  { value: 3, level: 1 },
  { value: 4, level: 2 },
  { value: 5, level: 2 },
])

// True breadth-first with path enumeration. Analogous to depth first with
// path enumeration, but we first sort by depth.
if (sequelize.options.dialect === 'postgres') {
;[rows, meta] = await sequelize.query(`
WITH RECURSIVE "TreeSearch" (
  "id",
  "parentId",
  "childIndex",
  "value",
  "name",
  "level",
  "prefix"
) AS (
  SELECT
    "id",
    "parentId",
    "childIndex",
    "value",
    "name",
    0,
    array[0]
  FROM "ParentIndexTree"
  WHERE "parentId" IS NULL

  UNION ALL

  SELECT
    "child"."id",
    "child"."parentId",
    "child"."childIndex",
    "child"."value",
    "child"."name",
    "parent"."level" + 1,
    "prefix" || "child"."childIndex"
  FROM "ParentIndexTree" AS "child"
  JOIN "TreeSearch" AS "parent"
    ON "child"."parentId" = "parent"."id"
)
SELECT * FROM "TreeSearch"
ORDER BY "level", "prefix"
`)
common.assertEqual(rows, [
  { value: 1, level: 0 },
  { value: 2, level: 1 },
  { value: 3, level: 1 },
  { value: 4, level: 2 },
  { value: 5, level: 2 },
])

// Equivalent with SEARCH syntax sugar, automatically tracks level and prefix for us.
;[rows, meta] = await sequelize.query(`
WITH RECURSIVE "TreeSearch" (
  "id",
  "parentId",
  "childIndex",
  "value",
  "name"
) AS (
  SELECT
    "id",
    "parentId",
    "childIndex",
    "value",
    "name"
  FROM "ParentIndexTree"
  WHERE "parentId" IS NULL

  UNION ALL

  SELECT
    "child"."id",
    "child"."parentId",
    "child"."childIndex",
    "child"."value",
    "child"."name"
  FROM "ParentIndexTree" AS "child"
  JOIN "TreeSearch" AS "parent"
    ON "child"."parentId" = "parent"."id"
)
SEARCH BREADTH FIRST BY "childIndex" SET "prefix"
SELECT * FROM "TreeSearch"
ORDER BY "prefix"
`)
common.assertEqual(rows, [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
])
}

// Pre-order depth first prefix string approach, aka "Path Enumeration".
// This produces actual pre-order depth-first.
// Maximum number of siblings is 16^nchars, otherwise won't work.
// Takes up a lot of memory if the tree is deep.
// Ideally we would want to use binary strings rather than hex ASCII
// for this to use a bit less memory rather than bytes.
// In PostgreSQL can use arrays instead, which overcomes both:
// - hex ASCII inneficiency
// - maximum depth restrictions
let nchars = 6
let printf
if (sequelize.options.dialect === 'sqlite') {
  printf = `printf('%0${nchars}x', "child"."childIndex")`
} else if (sequelize.options.dialect === 'postgres') {
  // Postgres' FORMAT function is very limited.
  printf = `lpad(cast("child"."childIndex" as text), ${nchars}, '0')`
}
;[rows, meta] = await sequelize.query(`
WITH RECURSIVE "TreeSearch" (
  "id",
  "parentId",
  "childIndex",
  "value",
  "name",
  "prefix"
) AS (
  SELECT
    "id",
    "parentId",
    "childIndex",
    "value",
    "name",
    '${'0'.repeat(nchars)}'
  FROM "ParentIndexTree"
  WHERE "parentId" IS NULL

  UNION ALL

  SELECT
    "child"."id",
    "child"."parentId",
    "child"."childIndex",
    "child"."value",
    "child"."name",
    "parent"."prefix" || ${printf}
  FROM "ParentIndexTree" AS "child"
  JOIN "TreeSearch" AS "parent"
    ON "child"."parentId" = "parent"."id"
)
SELECT * FROM "TreeSearch"
ORDER BY "prefix"
`)
common.assertEqual(rows, [
  { value: 1 },
  { value: 2 },
  { value: 4 },
  { value: 5 },
  { value: 3 },
])

if (sequelize.options.dialect === 'postgres') {
// Same as above but with PostgreSQL arrays so more efficient and general.
;[rows, meta] = await sequelize.query(`
WITH RECURSIVE "TreeSearch" (
  "id",
  "parentId",
  "childIndex",
  "value",
  "name",
  "prefix"
) AS (
  SELECT
    "id",
    "parentId",
    "childIndex",
    "value",
    "name",
    array[0]
  FROM "ParentIndexTree"
  WHERE "parentId" IS NULL

  UNION ALL

  SELECT
    "child"."id",
    "child"."parentId",
    "child"."childIndex",
    "child"."value",
    "child"."name",
    "parent"."prefix" || "child"."childIndex"
  FROM "ParentIndexTree" AS "child"
  JOIN "TreeSearch" AS "parent"
    ON "child"."parentId" = "parent"."id"
)
SELECT * FROM "TreeSearch"
ORDER BY "prefix"
`)
common.assertEqual(rows, [
  { value: 1 },
  { value: 2 },
  { value: 4 },
  { value: 5 },
  { value: 3 },
])

// Same as above but with SEARCH syntax sugar.
;[rows, meta] = await sequelize.query(`
WITH RECURSIVE "TreeSearch" (
  "id",
  "parentId",
  "childIndex",
  "value",
  "name"
) AS (
  SELECT
    "id",
    "parentId",
    "childIndex",
    "value",
    "name"
  FROM "ParentIndexTree"
  WHERE "parentId" IS NULL

  UNION ALL

  SELECT
    "child"."id",
    "child"."parentId",
    "child"."childIndex",
    "child"."value",
    "child"."name"
  FROM "ParentIndexTree" AS "child"
  JOIN "TreeSearch" AS "parent"
    ON "child"."parentId" = "parent"."id"
)
SEARCH DEPTH FIRST BY "childIndex" SET "prefix"
SELECT * FROM "TreeSearch"
ORDER BY "prefix"
`)
common.assertEqual(rows, [
  { value: 1 },
  { value: 2 },
  { value: 4 },
  { value: 5 },
  { value: 3 },
])
}

// Infinite loop detection with CYCLE.
// Create an infinite loop by setting the parent of 1 to 5.
// Shame I don't know a clean way of doing this in SQLite, besides using strings for the path prefix.
// https://cirosantilli.com/sql-recursive-prevent-infinite-recursion
if (sequelize.options.dialect === 'postgres') {
await sequelize.query('UPDATE "ParentIndexTree" SET "parentId" = 4 WHERE value = 1')
;[rows, meta] = await sequelize.query(`
WITH RECURSIVE "TreeSearch" (
  "id",
  "parentId",
  "childIndex",
  "value",
  "name",
  "level"
) AS (
  SELECT
    "id",
    "parentId",
    "childIndex",
    "value",
    "name",
    0
  FROM "ParentIndexTree"
  WHERE "value" = 1

  UNION ALL

  SELECT
    "child"."id",
    "child"."parentId",
    "child"."childIndex",
    "child"."value",
    "child"."name",
    "parent"."level" + 1
  FROM "ParentIndexTree" AS "child"
  JOIN "TreeSearch" AS "parent"
    ON "child"."parentId" = "parent"."id"
)
CYCLE "id" SET "isCycle" USING "path"
SELECT * FROM "TreeSearch"
WHERE NOT "isCycle"
ORDER BY "path"
`)
common.assertEqual(rows, [
  { value: 1, level: 0 },
  { value: 2, level: 1 },
  { value: 4, level: 2 },
  { value: 5, level: 2 },
  { value: 3, level: 1 },
])
await reset()
}

})().finally(() => { return sequelize.close() });
