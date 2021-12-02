#!/usr/bin/env node

// https://cirosantilli.com/file/sequelize/raw/parallel_select_and_update_deterministic.js

const assert = require('assert');
const common = require('../common');

// CLI arguments.
let isolation;
if (process.argv.length > 3) {
  isolation = process.argv[3]
} else {
  isolation = `SERIALIZABLE`
}

async function assertRaises(cb) {
  let hadException = false
  try {
    await cb()
  } catch (e) {
    hadException = true
  }
  assert(hadException)
}

const sequelizes = common.sequelizes(2, __filename, process.argv[2])
const sequelize0 = sequelizes[0]
const sequelize1 = sequelizes[1]
let rows, meta
;(async () => {
await common.drop(sequelize0, 'MyInt')
await sequelize0.query(`CREATE TABLE "MyInt" ( i INTEGER NOT NULL )`)
async function reset() {
  await sequelize0.query(`TRUNCATE "MyInt"`)
  await sequelize0.query(`INSERT INTO "MyInt" VALUES (0)`)
}
await reset()

// 0 updates, 1 updates, 0 commits
// error: could not serialize access due to concurrent update
await sequelize0.query(`BEGIN TRANSACTION ISOLATION LEVEL ${isolation}`)
await sequelize1.query(`BEGIN TRANSACTION ISOLATION LEVEL ${isolation}`)
await sequelize0.query(`UPDATE "MyInt" SET i = 1`)
// Waits for 0 to COMMIT, so we need async here to defer execution,
// otherwise would block the script forever.
;(async () => {
  await assertRaises(async () => sequelize1.query(`UPDATE "MyInt" SET i = 2`))
})()
await sequelize0.query(`COMMIT`)
await sequelize1.query(`COMMIT`)
;[rows, meta] = await sequelize0.query(`SELECT * FROM "MyInt"`)
assert.strictEqual(rows[0].i, 1)
await reset()

// 0 updates, 0 commits, 1 updates, 1 commits
// No error:.
await sequelize0.query(`BEGIN TRANSACTION ISOLATION LEVEL ${isolation}`)
await sequelize1.query(`BEGIN TRANSACTION ISOLATION LEVEL ${isolation}`)
await sequelize0.query(`UPDATE "MyInt" SET i = 1`)
await sequelize0.query(`COMMIT`)
await sequelize1.query(`UPDATE "MyInt" SET i = 2`)
await sequelize1.query(`COMMIT`)
;[rows, meta] = await sequelize0.query(`SELECT * FROM "MyInt"`)
assert.strictEqual(rows[0].i, 2)
await reset()

// 0 updates, 1 selects, 0 commits, 1 updates, 1 commits
// error: could not serialize access due to concurrent update
// Note how adding the SELECT makes it raise, that is the only difference from the previous example!
await sequelize0.query(`BEGIN TRANSACTION ISOLATION LEVEL ${isolation}`)
await sequelize1.query(`BEGIN TRANSACTION ISOLATION LEVEL ${isolation}`)
await sequelize0.query(`UPDATE "MyInt" SET i = 1`)
await sequelize1.query(`SELECT * FROM "MyInt"`)
await sequelize0.query(`COMMIT`)
await assertRaises(async () => await sequelize1.query(`UPDATE "MyInt" SET i = 2`))
await sequelize1.query(`COMMIT`)
;[rows, meta] = await sequelize0.query(`SELECT * FROM "MyInt"`)
assert.strictEqual(rows[0].i, 1)
await reset()

// Now we work with two rows.
// REPEATABLE READ: no error
// SERIALIZABLE: error: could not serialize access due to read/write dependencies among transactions
await sequelize0.query(`INSERT INTO "MyInt" VALUES (10)`)
await sequelize0.query(`BEGIN TRANSACTION ISOLATION LEVEL ${isolation}`)
await sequelize1.query(`BEGIN TRANSACTION ISOLATION LEVEL ${isolation}`)
await sequelize0.query(`UPDATE "MyInt" SET i = 1 WHERE i = 0`)
await sequelize1.query(`SELECT * FROM "MyInt"`)
await sequelize0.query(`COMMIT`)
if (isolation === 'SERIALIZABLE') {
  await assertRaises(async () => await sequelize1.query(`UPDATE "MyInt" SET i = 11 WHERE i = 10`))
} else {
  await sequelize1.query(`UPDATE "MyInt" SET i = 11 WHERE i = 10`)
}
await sequelize1.query(`COMMIT`)
;[rows, meta] = await sequelize0.query(`SELECT * FROM "MyInt" ORDER BY i ASC`)
assert.strictEqual(rows[0].i, 1)
if (isolation === 'SERIALIZABLE') {
  assert.strictEqual(rows[1].i, 10)
} else {
  assert.strictEqual(rows[1].i, 11)
}
await reset()

})().finally(() => {
  return Promise.all(sequelizes.map(s => s.close()))
});
