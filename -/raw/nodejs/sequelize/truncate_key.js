#!/usr/bin/env node

// https://stackoverflow.com/questions/39765582/in-sequelize-model-destroy-truncate-true-does-not-reset-primary-key

const assert = require('assert')
const path = require('path')
const { DataTypes } = require('sequelize')
const common = require('./common')
const sequelize = common.sequelize(__filename, process.argv[2], { define: { timestamps: false } })
;(async () => {
const IntegerNames = sequelize.define('IntegerNames', {
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
  },
}, {})
await IntegerNames.sync({force: true})
await IntegerNames.create({value: 2, name: 'two'})
await IntegerNames.create({value: 3, name: 'three'})
console.error((await IntegerNames.findOne({where: {value: 2}})).id)
await IntegerNames.truncate({cascade: true})
await IntegerNames.create({value: 5, name: 'five'})
await IntegerNames.create({value: 7, name: 'seven'})
console.error((await IntegerNames.findOne({where: {value: 5}})).id)
})().finally(() => { return sequelize.close() });
