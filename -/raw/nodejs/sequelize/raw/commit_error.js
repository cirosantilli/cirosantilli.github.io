#!/usr/bin/env node
// https://cirosantilli.com/sql-example
const assert = require('assert')
const common = require('../common')
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {
await common.drop(sequelize, `MyInt`)
await sequelize.query(`CREATE TABLE "MyInt" ( i INTEGER PRIMARY KEY )`)
await sequelize.query(`BEGIN TRANSACTION`)
await sequelize.query(`INSERT INTO "MyInt" VALUES (1)`)
try {
  await sequelize.query('asdfqwer')
} catch (e) {
  console.log('asdfqwr failed');
}
try {
  await sequelize.query(`INSERT INTO "MyInt" VALUES (2)`)
} catch (e) {
  // Also throws on PostgreSQL because after the current transaction is aborted,
  // further commands ignored until end of transaction block.
  // Does not throw on SQLite however.
  console.log('INSERT 2 failed');
}
await sequelize.query(`ROLLBACK`)
// This would work on PostgreSQL, but it does not work on SQLite.
// await sequelize.query(`COMMIT`)
let rows, meta
;[rows, meta] = await sequelize.query(`SELECT * FROM "MyInt" ORDER BY i ASC`)
assert.strictEqual(rows.length, 0)
})().finally(() => { return sequelize.close() });
