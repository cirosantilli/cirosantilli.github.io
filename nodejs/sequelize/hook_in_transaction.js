#!/usr/bin/env node

// https://github.com/sequelize/sequelize/issues/3534
// https://github.com/sequelize/sequelize/issues/8586

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
  },
  {
    hooks: {
      afterCreate: (integerName, options) => {
        assert.notStrictEqual(options.transaction, undefined)
      },
      beforeDestroy: (article, options) => {
        assert.notStrictEqual(options.transaction, undefined)
      },
    }
  },
);
await IntegerNames.sync({force: true})
let i;
await sequelize.transaction(async transaction => {
  i = await IntegerNames.create({value: 2, name: 'two'}, { transaction })
})
await sequelize.transaction(async transaction => {
  await i.destroy({ transaction })
})
})().finally(() => { return sequelize.close() });
