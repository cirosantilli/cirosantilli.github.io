#!/usr/bin/env node

// https://cirosantilli.com/sql-example
//
// We try to find the city of each country that has the most sales.

const { DataTypes, Op } = require('sequelize');
const common = require('../common')
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {

// Create tables and data.
await common.drop(sequelize, `Sales`)
await sequelize.query(`
CREATE TABLE "Sales" (
  "country" TEXT,
  "city"    TEXT,
  "price"   INTEGER
)
`)
async function reset() {
  await sequelize.query(`DELETE FROM "Sales"`)
  return sequelize.query(`
INSERT INTO "Sales" VALUES
  ('uk',     'london',     10),
  ('uk',     'london',     40),
  ('uk',     'manchester', 20),
  ('france', 'paris',      30),
  ('france', 'lyon',       30)
`)
}

async function resetDraw() {
  await sequelize.query(`DELETE FROM "Sales"`)
  return sequelize.query(`
INSERT INTO "Sales" VALUES
  ('uk',     'london',     10),
  ('uk',     'manchester', 20),
  ('france', 'paris',      30),
  ('france', 'lyon',       30),
  ('italy',  'rome',       40)
`)
}

await reset()
let rows, meta

common.assertEqual.typecast = { cnt: (s) => parseInt(s, 10) }

// Country that made the most individual sales.
// In case of a tie, pick the one with first alphabetical country name.
// * MySQL https://stackoverflow.com/questions/12235595/find-most-frequent-value-in-sql-column
async function countryWithMostSales() {
  return (await sequelize.query(`
SELECT
  "country",
  COUNT(country) AS "cnt"
FROM "Sales"
GROUP BY "country"
ORDER BY
  "cnt" DESC,
  "country" ASC
LIMIT 1;
`))[0]
}
common.assertEqual(await countryWithMostSales(), [
  { country: 'uk', cnt: 3 },
])
await resetDraw()
common.assertEqual(await countryWithMostSales(), [
  { country: 'france', cnt: 2 },
])

// Same as countryWithMostSales but return all countries in case of tie,
// sorted by alphabetical country name.
//
// * MySQL https://stackoverflow.com/questions/63986026/find-the-most-frequent-value-in-mysql-display-all-in-case-of-a-tie/63986233#63986233
async function countryWithMostSalesAll() {
  return (await sequelize.query(`
SELECT
  "country",
  COUNT(country) AS "cnt"
FROM "Sales"
GROUP BY "country"
HAVING
  COUNT("country") = (
    SELECT COUNT("country") AS "cnt"
    FROM "Sales"
    GROUP BY "country"
    ORDER BY "cnt" DESC
    LIMIT 1
  )
ORDER BY "country" ASC
`))[0]
}
await reset()
common.assertEqual(await countryWithMostSalesAll(), [
  { country: 'uk', cnt: 3 },
])
await resetDraw()
common.assertEqual(await countryWithMostSalesAll(), [
  { country: 'france', cnt: 2 },
  { country: 'uk', cnt: 2 },
])

// Same but with RANK. Superior where available.
async function countryWithMostSalesAllRank() {
  return (await sequelize.query(`
SELECT "country", "cnt"
  FROM (
    SELECT
      "country",
      COUNT("country") AS "cnt",
      RANK() OVER (ORDER BY COUNT(*) DESC) "rnk"
    FROM "Sales"
    GROUP BY "country"
  ) AS "sub"
WHERE "rnk" = 1
ORDER BY "country" ASC
`))[0]
}
await reset()
common.assertEqual(await countryWithMostSalesAllRank(), [
  { country: 'uk', cnt: 3 },
])
await resetDraw()
common.assertEqual(await countryWithMostSalesAllRank(), [
  { country: 'france', cnt: 2 },
  { country: 'uk', cnt: 2 },
])

async function resetCityWithMostSalesPerCountry() {
  await sequelize.query(`DELETE FROM "Sales"`)
  return sequelize.query(`
INSERT INTO "Sales" VALUES
  ('uk',  'london',    30),
  ('uk',  'london',    40),
  ('uk',  'london',    40),
  ('uk',  'cambridge', 20),
  ('uk',  'cambridge', 30),
  ('usa', 'cambridge', 50),
  ('usa', 'cambridge', 50)
`)
}

// Find the city with the most sales for each country. If multiple are tied, returned all of them.
// * PostgreSQL
//   * https://stackoverflow.com/questions/344665/get-most-common-value-for-each-value-of-another-column-in-sql
//   * https://dba.stackexchange.com/questions/193307/find-most-frequent-values-for-a-given-column
// * SQLite https://stackoverflow.com/questions/39432789/sql-query-for-finding-the-most-frequent-value-of-a-grouped-by-value
// * MySQL https://stackoverflow.com/questions/1407723/mysql-select-most-frequent-by-group
// * https://dba.stackexchange.com/questions/193307/find-most-frequent-values-for-a-given-column
//
// This method works on both SQLite and PostgreSQL, nice, mentioned at:
// https://stackoverflow.com/questions/344665/get-most-common-value-for-each-value-of-another-column-in-sql/12448971#12448971
async function cityWithMostSalesPerCountry() {
  return (await sequelize.query(`
SELECT "country", "city", "cnt"
  FROM (
    SELECT
      "country",
      "city",
      COUNT(*) AS "cnt",
      RANK() OVER (
        PARTITION BY "country"
        ORDER BY COUNT(*) DESC
      ) AS "rnk"
    FROM "Sales"
    GROUP BY "country", "city"
  ) AS "sub"
WHERE "rnk" = 1
ORDER BY
  "country" ASC,
  "city" ASC
`))[0]
}
await resetCityWithMostSalesPerCountry()
common.assertEqual(await cityWithMostSalesPerCountry(), [
  // London has 2 total sales, Cambridge has 3. But over the top 3 highest valued sales,
  // London has 2 and Cambridge only 1, so London wins.
  { country: 'uk',  city: 'london',    cnt: 3 },
  { country: 'usa', city: 'cambridge', cnt: 2 },
])

async function resetMostSalesInTopN() {
  await sequelize.query(`DELETE FROM "Sales"`)
  return sequelize.query(`
INSERT INTO "Sales" VALUES
  ('uk',  'london',    30),
  ('uk',  'london',    40),
  ('uk',  'cambridge', 10),
  ('uk',  'cambridge', 20),
  ('uk',  'cambridge', 30),
  ('usa', 'cambridge', 50),
  ('usa', 'cambridge', 50)
`)
}

// Find the city with the most sales in a given country, but considering
// only the top n highest valued sales in the country. Sort ties alphabetically.
async function cityWithMostSalesInTopNForCountry(country, n) {
  return (await sequelize.query(`
SELECT
  "city",
  COUNT(*) AS "cnt"
FROM (
  SELECT *
  FROM "Sales"
  WHERE "country" = :country
  ORDER BY "price" DESC
  LIMIT :n
) AS "sub"
GROUP BY "city"
ORDER BY
  "cnt" DESC,
  "city" ASC
LIMIT 1;
`,
    {
      replacements: {
        country,
        n,
      }
    }
  ))[0]
}
await resetMostSalesInTopN()
console.error(await cityWithMostSalesInTopNForCountry('uk', 3))
common.assertEqual(await cityWithMostSalesInTopNForCountry('uk', 3), [
  // London has 2 total sales, Cambridge has 3. But over the top 3 highest valued sales,
  // London has 2 and Cambridge only 1, so London wins.
  { city: 'london', cnt: 2 },
])
common.assertEqual(await cityWithMostSalesInTopNForCountry('usa', 3), [
  { city: 'cambridge', cnt: 2 },
])

// Find the city with the most sales for each country, but considering
// only the top n highest valued sales in the country. Sort ties alphabetically.
async function cityWithMostSalesInTopN(n) {
  return (await sequelize.query(`
SELECT "country", "city", "cnt"
  FROM (
    SELECT
      "country",
      "city",
      COUNT(*) AS "cnt",
      ROW_NUMBER() OVER (
        PARTITION BY "country"
        ORDER BY COUNT(*) DESC
      ) AS "freqRank"
    FROM (
      SELECT
        ROW_NUMBER() OVER (
          PARTITION BY "country"
          ORDER BY "price" DESC
        ) AS "priceRank",
        *
      FROM "Sales"
    ) AS "TopSales"
    WHERE "TopSales"."priceRank" <= :n
    GROUP BY "country", "city"
  ) AS "TopCities"
WHERE "TopCities"."freqRank" = 1
ORDER BY
  "country" ASC
`,
    {
      replacements: {
        n,
      }
    }
  ))[0]
}
await resetMostSalesInTopN()
common.assertEqual(await cityWithMostSalesInTopN(3), [
  { country: 'uk',  city: 'london',    cnt: 2 },
  { country: 'usa', city: 'cambridge', cnt: 2 },
])

await sequelize.close();
})();
