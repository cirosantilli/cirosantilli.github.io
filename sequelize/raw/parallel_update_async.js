#!/usr/bin/env node

// https://cirosantilli.com/sql-isolation-level-example

const assert = require('assert');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { DataTypes, Op } = require('sequelize');
const common = require('./common');
const sequelize = common.sequelize(__filename, process.argv[2], {logging: false})

async function inc(n, id) {
  for (let i = 0; i < n; i++) {
    console.error(`${i} ${id}`);
    await sequelize.query(`UPDATE MyInt SET i = i + 1`)
  }
}

let nthreads;
if (process.argv.length > 2) {
  nthreads = parseInt(process.argv[3], 10)
} else {
  nthreads = 10;
}
let n;
if (process.argv.length > 3) {
  n = parseInt(process.argv[4], 10)
} else {
  n = 10;
}

;(async () => {
try { await sequelize.query(`DROP TABLE MyInt`) } catch (e) {}
await sequelize.query(`CREATE TABLE MyInt ( i INTEGER NOT NULL)`)
await sequelize.query(`INSERT INTO MyInt VALUES (0)`)
const arr = []
for (let i = 0; i < n; i++) {
  arr.push(inc(n, i))
}
await Promise.all(arr)
;[rows, meta] = await sequelize.query(`SELECT * FROM MyInt`)
assert.strictEqual(rows[0].i, nthreads * n)
await sequelize.close();
})();
