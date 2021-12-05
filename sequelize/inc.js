#!/usr/bin/env node

// https://cirosantilli.com/sequelize-example

const assert = require('assert');
const common = require('./common')
const path = require('path');
const { DataTypes } = require('sequelize');
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {
const IntegerNames = sequelize.define('IntegerNames', {
  value: {
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
  },
});
await IntegerNames.sync({force: true})
await IntegerNames.create({value: 2, name: 'two'});
await IntegerNames.create({value: 3, name: 'three'});
await IntegerNames.create({value: 5, name: 'five'});
const integerName5 = await IntegerNames.findOne({ where: { value: 5 } });
await integerName5.increment('value')
// SQLite updates, but PostgreSQL doesn't.
console.error(integerName5.value);
// So we do another find to get the updated value.
const integerName6 = await IntegerNames.findOne({ where: { value: 6 } });
assert.strictEqual(integerName6.name, 'five')
})().finally(() => { return sequelize.close() });
