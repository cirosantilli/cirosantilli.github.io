#!/usr/bin/env node
const assert = require('assert')
const path = require('path')
const { DataTypes } = require('sequelize')
const common = require('./common')
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {
const Item = sequelize.define('Item', {
    major: DataTypes.INTEGER,
    minor: DataTypes.INTEGER,
    patch: DataTypes.INTEGER,
  }, {
    indexes: [
      {
        fields: ['major', 'minor'],
        unique: true,
      }
    ]
  }
)
await Item.sync({ force: true })
await Item.create({ major: 1, minor: 1, patch: 11 })
await Item.create({ major: 1, minor: 2, patch: 12 })
let threw = false
try {
  await Item.create({ major: 1, minor: 2, patch: 122 })
} catch (e) {
  threw = true
}

// Upsert with composite index: existing.
await Item.upsert({ major: 1, minor: 2, patch: 122 })
rows = await Item.findAll({ order: [['major', 'ASC'], ['minor', 'ASC'], ['patch', 'ASC']] });
common.assertEqual(rows, [
  { major: 1, minor: 1, patch: 11 },
  { major: 1, minor: 2, patch: 122 },
])

// Upsert with composite index: new.
await Item.upsert({ major: 1, minor: 3, patch: 13 })
rows = await Item.findAll({ order: [['major', 'ASC'], ['minor', 'ASC'], ['patch', 'ASC']] });
common.assertEqual(rows, [
  { major: 1, minor: 1, patch: 11 },
  { major: 1, minor: 2, patch: 122 },
  { major: 1, minor: 3, patch: 13 },
])

assert(threw)
})().finally(() => { return sequelize.close() })
