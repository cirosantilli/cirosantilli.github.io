#!/usr/bin/env node
// https://cirosantilli.com/sequelize-example
const assert = require('assert')
const path = require('path')
const { DataTypes, Sequelize } = require('sequelize')
const sql_formatter = require('sql-formatter')
let dialect
let language
function logging(query_string, query_object) {
  console.log(sql_formatter.format(query_string.replace(/^.*: /, ''), { language }))
  if (query_object.bind !== undefined) {
    // https://stackoverflow.com/questions/55715724/how-to-log-queries-with-bounded-paramenters-in-sequelize
    // https://stackoverflow.com/questions/59712807/sequelize-how-to-log-raw-query
    console.log(query_object.bind.map((v, i) => [i + 1, v]));
  }
  console.log();
}
if (process.argv[2] === 'p') {
  dialect = 'postgres'
  sequelize = new Sequelize('tmp', undefined, undefined, {
    dialect,
    host: '/var/run/postgresql',
    logging,
  })
} else {
  dialect = 'sqlite'
  sequelize = new Sequelize({
    dialect,
    storage: 'tmp.sqlite',
    logging,
  })
}
if (dialect === 'sqlite') {
  // Not implemented.
  // https://github.com/zeroturnaround/sql-formatter/issues/133
  language = 'postgresql'
} else if (dialect === 'postgres') {
  language = 'postgresql'
}
;(async () => {
const IntegerNames = sequelize.define('IntegerNames', {
  value: { type: DataTypes.INTEGER },
  name: { type: DataTypes.STRING },
});
await IntegerNames.sync({ force: true })
async function reset() {
  await sequelize.truncate({ cascade: true })
  await IntegerNames.create({ value: 2, name: 'two' })
  await IntegerNames.create({ value: 3, name: 'three' })
  await IntegerNames.create({ value: 5, name: 'five' })
}
await reset()
let rows
rows = await IntegerNames.findAll()
assert.strictEqual(rows[0].id, 1)
assert.strictEqual(rows[0].name, 'two')
assert.strictEqual(rows[0].value, 2)
assert.strictEqual(rows[1].id, 2)
assert.strictEqual(rows[1].name, 'three')
assert.strictEqual(rows[1].value, 3)
assert.strictEqual(rows[2].id, 3)
assert.strictEqual(rows[2].name, 'five')
assert.strictEqual(rows[2].value, 5)
assert.strictEqual(rows.length, 3)
})().finally(() => { return sequelize.close() })
