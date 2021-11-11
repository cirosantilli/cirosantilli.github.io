#!/usr/bin/env node

// https://cirosantilli.com/sql-parallel-update-example

const assert = require('assert');
const common = require('../common');

async function inc(sequelizes, sequelizeIdx, n) {
  for (let i = 0; i < n; i++) {
    console.error(`${sequelizeIdx} ${i}`);
    await sequelizes[sequelizeIdx].query(`UPDATE "MyInt" SET i = i + 1`)
  }
}

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

const sequelizes = Array.from({ length: nthreads },
  () => common.sequelize(__filename, process.argv[2], { logging: false }))
const sequelize = sequelizes[0]

;(async () => {
await common.drop(sequelize, 'MyInt')
await sequelize.query(`CREATE TABLE "MyInt" ( i INTEGER NOT NULL)`)
await sequelize.query(`INSERT INTO "MyInt" VALUES (0)`)
const arr = []
for (let i = 0; i < nthreads; i++) {
  arr.push(inc(sequelizes, i, n))
}
await Promise.all(arr)
;[rows, meta] = await sequelize.query(`SELECT * FROM "MyInt"`)
})().finally(() => {
  return Promise.all(sequelizes.map(s => s.close()))
});
