#!/usr/bin/env node
// https://cirosantilli.com/sequelize-example
const assert = require('assert')
const path = require('path')
const { DataTypes } = require('sequelize')
const common = require('./common')
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {
const IntegerNames = sequelize.define('IntegerNames',
  {
    value: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
  },
  {
    hooks: {
      beforeCreate: (integerName, options) => {
        if (integerName.value === 42) {
          throw new Error('beforeCreate')
        }
      },
      beforeValidate: (integerName, options) => {
        if (integerName.value === 43) {
          throw new Error('beforeValidate')
        }
      },
      beforeUpdate: (integerName, options) => {
        if (integerName.value === 5) {
          throw new Error('beforeUpdate')
        }
      },
    }
  },
)
await IntegerNames.sync({ force: true })
async function reset() {
  await sequelize.truncate({ cascade: true })
  await IntegerNames.create({ value: 2, name: 'two' })
  await IntegerNames.create({ value: 3, name: 'three' })
  await IntegerNames.create({ value: 5, name: 'five' })
}
async function assertUnchanged() {
  const rows = await IntegerNames.findAll()
  common.assertEqual(rows, [
    { id: 1, value: 2, name: 'two',   },
    { id: 2, value: 3, name: 'three', },
    { id: 3, value: 5, name: 'five',  },
  ])
}
await reset()
let rows, exc
await assertUnchanged()

// beforeCreate
exc = undefined
try {
  await IntegerNames.create({ value: 42, name: 'forty-two' })
} catch (e) {
  exc = e
}
assert.strictEqual(exc.message, 'beforeCreate')
await assertUnchanged()

// beforeValidate
exc = undefined
try {
  await IntegerNames.create({ value: 43, name: 'forty-three' })
} catch (e) {
  exc = e
}
assert.strictEqual(exc.message, 'beforeValidate')
await assertUnchanged()

// beforeUpdate
exc = undefined
try {
  await IntegerNames.update(
    { name: 'five hacked', },
    {
      where: { value: 5 },
      individualHooks: true,
    },
  );
} catch (e) {
  exc = e
}
assert.strictEqual(exc.message, 'beforeUpdate')
await assertUnchanged()

// using the beforeValidate
exc = undefined
try {
  await IntegerNames.update(
    { value: 43, },
    {
      where: { value: 5 },
    },
  );
} catch (e) {
  exc = e
}
assert.strictEqual(exc.message, 'beforeValidate')
await assertUnchanged()

})().finally(() => { return sequelize.close() })
