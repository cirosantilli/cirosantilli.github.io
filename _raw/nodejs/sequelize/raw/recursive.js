#!/usr/bin/env node
// https://cirosantilli.com/sql-recursive-query
const assert = require('assert')
const common = require('../common')
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {

// Example that does not interact with any tables.
;[rows, meta] = await sequelize.query(`
WITH RECURSIVE "cte"(n) AS (
  SELECT 1 AS "n"
  UNION ALL
  SELECT "n" + 1 FROM "cte" WHERE "n" < 5
)
SELECT * from "cte"
ORDER BY "n" ASC
`)
common.assertEqual(rows, [
  { n: 1, },
  { n: 2, },
  { n: 3, },
  { n: 4, },
  { n: 5, },
])

// Multiple starting points.
;[rows, meta] = await sequelize.query(`
WITH RECURSIVE "cte"(n) AS (
  WITH "t" ("n") AS (VALUES (1), (3)) SELECT "n" FROM "t"
  UNION ALL
  SELECT "n" * 2 FROM "cte" WHERE "n" < 10
)
SELECT * from "cte"
ORDER BY "n" ASC
`)
// TODO how to also fork multiple times without a table?
// WITH "t" ("n") AS (VALUES ("m" * 2), ("m" * 3)) SELECT "m" FROM "cte"
common.assertEqual(rows, [
  { n: 1, },
  { n: 2, },
  { n: 3, },
  { n: 4, },
  { n: 6, },
  { n: 8, },
  { n: 12, },
  { n: 16, },
])

// Cycle detection
if (sequelize.options.dialect === 'postgres') {
;[rows, meta] = await sequelize.query(`
WITH RECURSIVE "cte"(n) AS (
  SELECT 0 AS "n"
  UNION ALL
  SELECT ("n" + 1) % 4 FROM "cte"
)
CYCLE "n" SET "is_cycle" USING "path"
SELECT * from "cte" WHERE NOT "is_cycle"
ORDER BY "n" ASC
`)
// TODO how to also fork multiple times without a table?
// WITH "t" ("n") AS (VALUES ("m" * 2), ("m" * 3)) SELECT "m" FROM "cte"
common.assertEqual(rows, [
  { n: 0, },
  { n: 1, },
  { n: 2, },
  { n: 3, },
])
}

})().finally(() => { return sequelize.close() });
