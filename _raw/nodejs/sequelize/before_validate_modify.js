#!/usr/bin/env node

// https://cirosantilli.com/sequelize-exmaple

const assert = require('assert');
const common = require('./common')
const { DataTypes } = require('sequelize');
const sequelize = common.sequelize(__filename, process.argv[2])

;(async () => {
const IntegerNames = sequelize.define('IntegerNames',
  {
    value: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
    name2: {
      type: DataTypes.STRING,
    },
  },
  {
    hooks: {
      beforeValidate: (integerName, options) => {
        integerName.name2 = integerName.name + 'asdf'
        // This is required.
        options.fields.push('name2');
      }
    }
  },
);
await IntegerNames.sync({force: true})
await IntegerNames.create({value: 2, name: 'two'});
const integerName = await IntegerNames.findOne({ where: { value: 2 } });
assert.strictEqual(integerName.name, 'two');
assert.strictEqual(integerName.name2, 'twoasdf');

integerName.name = 'TWO'
await integerName.save();
const integerName2 = await IntegerNames.findOne({ where: { value: 2 } });
assert.strictEqual(integerName2.name, 'TWO');
// Fails without the options.fields.push.
assert.strictEqual(integerName2.name2, 'TWOasdf');
})().finally(() => { return sequelize.close() });
