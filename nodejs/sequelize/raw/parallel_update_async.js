#!/usr/bin/env node

// https://cirosantilli.com/file/sequelize/raw/parallel_update_async.js

const assert = require('assert');
const common = require('../common');

async function inc(sequelize, n) {
  for (let i = 0; i < n; i++) {
    await sequelize.query(`UPDATE "MyInt" SET i = i + 1`)
  }
}

// CLI arguments.
let nthreads;
if (process.argv.length > 3) {
  nthreads = parseInt(process.argv[3], 10)
} else {
  nthreads = 2;
}
let n;
if (process.argv.length > 4) {
  n = parseInt(process.argv[4], 10)
} else {
  n = 10;
}

const sequelizes = common.sequelizes(nthreads, __filename, process.argv[2])
const sequelize = sequelizes[0]
;(async () => {
await common.drop(sequelize, 'MyInt')
await sequelize.query(`CREATE TABLE "MyInt" ( i INTEGER NOT NULL)`)
await sequelize.query(`INSERT INTO "MyInt" VALUES (0)`)
const arr = []
for (let i = 0; i < nthreads; i++) {
  arr.push(inc(sequelizes[i], n))
}
await Promise.all(arr)
;[rows, meta] = await sequelize.query(`SELECT * FROM "MyInt"`)
assert.strictEqual(rows[0].i, nthreads * n)
})().finally(() => {
  return Promise.all(sequelizes.map(s => s.close()))
});
