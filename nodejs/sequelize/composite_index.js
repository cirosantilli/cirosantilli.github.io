#!/usr/bin/env node
const assert = require('assert')
const path = require('path')
const { DataTypes } = require('sequelize')
const common = require('./common')
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {
const Item = sequelize.define('Item', {
    minor: DataTypes.INTEGER,
    major: DataTypes.INTEGER,
  }, {
    indexes: [
      {
        fields: ['minor', 'major'],
        unique: true,
      }
    ]
  }
)
await Item.sync({ force: true })
await Item.create({ minor: 1, major: 1 })
await Item.create({ minor: 1, major: 2 })
let threw = false
try {
  await Item.create({ minor: 1, major: 2 })
} catch (e) {
  threw = true
}
assert(threw)
})().finally(() => { return sequelize.close() })
