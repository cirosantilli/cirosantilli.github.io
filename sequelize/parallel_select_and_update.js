#!/usr/bin/env node

// https://cirosantilli.com/file/sequelize/parallel_select_and_update.js

const assert = require('assert');
const common = require('./common');
const sequelize = require('sequelize');
const { Transaction } = require('sequelize');

async function transactionWithRetry(sequelize, transactionArgs, cb) {
  let done = false
  while (!done) {
    try {
      await sequelize.transaction(transactionArgs, cb)
      done = true
    } catch (e) {
      if (
        sequelize.options.dialect === 'postgres' &&
        // This can happen randomly, and we have to re-run the transaction:
        // - could not serialize access due to read/write dependencies among transactions
        // - could not serialize access due to concurrent update
        // https://www.postgresql.org/docs/13/errcodes-appendix.html
        e.original.code === '40001'
      ) {
        await sequelize.query(`ROLLBACK`)
        // COMMIT would also work here in PostgreSQL it seems, when it enters error state it ignores
        // everything until the transaction finishes, and the COMMIT then becomes as ROLLBACK:
        // https://stackoverflow.com/questions/27245101/why-should-we-use-rollback-in-sql-explicitly/27245234#27245234
        // but can't find any clear docs on it, this one:
        // https://stackoverflow.com/questions/48277519/how-to-use-commit-and-rollback-in-a-postgresql-function/48277708#48277708
        // points to some possible docs, but not very direct.
        // await sequelize.query(`COMMIT`)
      } else {
        // Error that we don't know how to handle.
        throw e;
      }
    }
  }
}

async function inc(sequelize, n, isolation, lock) {
  for (let i = 0; i < n; i++) {
    const transactionArgs = {}
    if (isolation !== undefined) {
      transactionArgs.isolationLevel = Transaction.ISOLATION_LEVELS[isolation]
    }
    await transactionWithRetry(sequelize, transactionArgs, async t => {
      const findArgs = { transaction: t }
      if (lock !== undefined) {
        findArgs.lock = t.LOCK[lock]
      }
      const rows = await sequelize.models.MyInt.findAll(findArgs)
      const newI = rows[0].i + 1
      await sequelize.models.MyInt.update({ i: newI }, { where: {}, transaction: t })
    })
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
const isolation = process.argv[5]
const lock = process.argv[6]

const sequelizes = common.sequelizes(nthreads, __filename, process.argv[2])
;(async () => {

for (let a_sequelize of sequelizes) {
  const MyInt = a_sequelize.define('MyInt', {
    i: { type: sequelize.DataTypes.INTEGER, },
  });
}
await sequelizes[0].models.MyInt.sync({force: true})
await sequelizes[0].models.MyInt.create({ i: 0 });
const arr = []
for (let i = 0; i < nthreads; i++) {
  arr.push(inc(sequelizes[i], n, isolation, lock))
}
await Promise.all(arr)
const rows = await sequelizes[0].models.MyInt.findAll()
assert.strictEqual(rows[0].i, nthreads * n)
})().finally(() => {
  return Promise.all(sequelizes.map(s => s.close()))
});
