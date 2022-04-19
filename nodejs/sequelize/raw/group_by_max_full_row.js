#!/usr/bin/env node
// https://cirosantilli.com/sql-example
const { DataTypes, Op } = require('sequelize');
const common = require('../common')
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {

// Create tables and data.
await common.drop(sequelize, `CitySales`)
// This would normally be done with many to many since tagid and tagName are redundant.
// We are doing it like this just to illustrate a post JOIN table state.
await sequelize.query(`
CREATE TABLE "CitySales" (
  "country" TEXT,
  "city"    TEXT,
  "sales"   INTEGER
)
`)
async function reset() {
  await sequelize.query(`DELETE FROM "CitySales"`)
  return sequelize.query(`
INSERT INTO "CitySales" VALUES
  ('uk',     'london',     10),
  ('uk',     'manchester', 20),
  ('france', 'paris',      30),
  ('france', 'lyon',       30)
`)
}
await reset()
let rows, meta

// DISTINCT ON
if (sequelize.options.dialect === 'postgres') {
  // The ORDER BY must start with "country", otherwise in Postgres 13.5 it fails with
  // SELECT DISTINCT ON expressions must match initial ORDER BY expressions
  // https://www.reddit.com/r/PostgreSQL/comments/i79jph/help_understanding_select_distinct_on_expressions/
  ;[rows, meta] = await sequelize.query(`
SELECT DISTINCT ON ("country") *
FROM "CitySales"
ORDER BY "country" ASC, "sales" DESC, "city" ASC
`)
  common.assertEqual(rows, [
    // The city from France. We had two tied for the max, paris and lyon,
    // but lyon is chosen due to the ASC city sort.
    //
    // lyon comes first because we were forced to do a country ordering first.
    { city: 'lyon' },
    // The city from UK.
    { city: 'manchester' },
  ])
} else if (sequelize.options.dialect === 'sqlite') {
  // On SQLite we can just group by and select non aggregates,
  // plus min/max magically guarantee that the matching row is returned.
  //
  // However, we can't obtain the exact same output which PostgreSQL SELECT DISTINCT ON produces,
  // because we can't select between paris and lyon via the ORDER BY (only the max matters), and we can't
  // add a second min() to achieve that either because the docs mention:
  // > Only the built-in min() and max() functions work this way.
  ;[rows, meta] = await sequelize.query(`
SELECT *, max("sales")
FROM "CitySales"
GROUP BY "country"
ORDER BY "country" ASC
`)
  common.assertEqual(rows, [
    // Behaviour here is undefined between paris an lyon,
    // there is no way to disambiguate ties.
    { },
    { city: 'manchester' },
  ])
}

if (sequelize.options.dialect === 'postgres') {
  // We can work around the forced initial country ordering with a subquery.
  // But not sure how to solve the problem if a LIMIT is required with the alternate ordering.
  // https://stackoverflow.com/questions/5803032/group-by-to-return-entire-row
  ;[rows, meta] = await sequelize.query(`
SELECT * FROM (
  SELECT DISTINCT ON ("country") *
  FROM "CitySales"
  ORDER BY "country" ASC, "sales" DESC, "city" ASC
) AS t ORDER BY "t"."city" DESC
`)
  common.assertEqual(rows, [
    { city: 'manchester' },
    { city: 'lyon' },
  ])
}

await sequelize.close();
})();
