#!/usr/bin/env node

// https://cirosantilli.com/sql-example
//
// We try to find the top N sales of each country.

const { DataTypes, Op } = require('sequelize');
const common = require('../common')
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {

// Create tables and data.
await common.drop(sequelize, `Sales`)
await sequelize.query(`
CREATE TABLE "Sales" (
  "country" TEXT,
  "city" TEXT,
  "price"   INTEGER
)
`)
async function reset() {
  await sequelize.query(`DELETE FROM "Sales"`)
  return sequelize.query(`
INSERT INTO "Sales" VALUES
  ('uk',     'london', 10),
  ('uk',     'london', 40),
  ('uk',     'oxford', 20),
  ('uk',     'oxford',  5),
  ('france', 'paris', 30),
  ('france', 'lyon',  20),
  ('france', 'paris', 15)
`)
}

await reset()
let rows, meta

common.assertEqual.typecast = { cnt: (s) => parseInt(s, 10) }

async function topSalesPerCountry(n) {
  return (await sequelize.query(`
SELECT *
FROM (
    SELECT
      ROW_NUMBER() OVER (
        PARTITION BY "country"
        ORDER BY "price" DESC
      ) AS "rnk",
      *
    FROM "Sales"
  ) sub
WHERE
  "sub"."rnk" <= :n
ORDER BY
  "sub"."country" ASC,
  "sub"."price" DESC
`,
    {
      replacements: {
        n
      }
    }
  ))[0]
}
common.assertEqual(await topSalesPerCountry(2), [
  { country: 'france', city: 'paris',  price: 30 },
  { country: 'france', city: 'lyon',   price: 20 },
  { country: 'uk',     city: 'london', price: 40 },
  { country: 'uk',     city: 'oxford', price: 20 },
])

await sequelize.close();
})();
