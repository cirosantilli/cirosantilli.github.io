const assert = require('assert')
const path = require('path')

/*
Might move things forward, but fails instead with an error that likely comes from sqlite3
also not being compatible with webpack:

ERROR in ./node_modules/node-pre-gyp/lib/info.js 14:14-32
Module not found: Error: Can't resolve 'aws-sdk' in '/home/ciro/bak/git/cirosantilli.github.io/webpack/sequelize/node_modules/node-pre-gyp/lib'
 @ ./node_modules/node-pre-gyp/lib/ sync ^\.\/.*$ ./info.js ./info
 @ ./node_modules/node-pre-gyp/lib/node-pre-gyp.js 52:13-36 184:38-55
 @ ./node_modules/sqlite3/lib/sqlite3-binding.js 1:13-36
 @ ./node_modules/sqlite3/lib/sqlite3.js 2:14-45
 @ ./index.js 3:16-34
*/
//const sqlite3 = require('sqlite3')
const { DataTypes, Sequelize } = require('sequelize')
let sequelize
if (process.argv[2] === 'p') {
  sequelize = new Sequelize('tmp', undefined, undefined, {
    dialect: 'postgres',
    host: '/var/run/postgresql',
  })
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'tmp.sqlite',
  })
}
function assertEqual(rows, rowsExpect) {
  assert.strictEqual(rows.length, rowsExpect.length)
  for (let i = 0; i < rows.length; i++) {
    let row = rows[i]
    let rowExpect = rowsExpect[i]
    for (let key in rowExpect) {
      assert.strictEqual(row[key], rowExpect[key])
    }
  }
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
rows = await IntegerNames.findAll({ order: [['value', 'ASC']] })
assertEqual(rows, [
  { id: 1, value: 2, name: 'two',   },
  { id: 2, value: 3, name: 'three', },
  { id: 3, value: 5, name: 'five',  },
])
})().finally(() => { return sequelize.close() })
