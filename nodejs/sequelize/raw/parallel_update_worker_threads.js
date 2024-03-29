#!/usr/bin/env node

// https://cirosantilli.com/file/sequelize/raw/parallel_update_async.js

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { DataTypes, Op } = require('sequelize');
const common = require('../common');
const sequelize = common.sequelize(__filename, process.argv[2], {logging: false})

;(async () => {
if (isMainThread) {
  const assert = require('assert');

  // Create tables and data.
  await common.drop(sequelize, 'MyInt')
  await sequelize.query(`CREATE TABLE MyInt ( i INTEGER NOT NULL)`)
  await sequelize.query(`INSERT INTO MyInt VALUES (0)`)
  const threadCount = 2;
  const incsPerThread = 10;
  const threads = new Set();
  for (let i = 0; i < threadCount; i++) {
    threads.add(new Worker(__filename, { workerData: { incsPerThread } }));
  }
  for (let worker of threads) {
    worker.on('error', err => { throw err; });
    worker.on('exit', async () => {
      threads.delete(worker);
      if (threads.size === 0) {
        //;[rows, meta] = await sequelize.query(`SELECT * FROM MyInt`)
        //assert.strictEqual(rows[0].i, threadCount * incsPerThread)
        await sequelize.close();
      }
    })
  }
} else {
  for (let i = 0; i < workerData.incsPerThread; i++) {
    await sequelize.query(`UPDATE MyInt SET i = i + 1`)
  }
  await sequelize.close();
}
})();
