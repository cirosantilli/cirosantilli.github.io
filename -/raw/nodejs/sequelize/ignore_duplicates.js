#!/usr/bin/env node

// https://cirosantilli.com/sequelize-example

const assert = require('assert');
const path = require('path');
const { DataTypes } = require('sequelize');
const common = require('./common')
const sequelize = common.sequelize(
  __filename,
  process.argv[2],
  {define: { timestamps: false }}
)
;(async () => {
const Tag = sequelize.define('Tag', {
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
  name2: {
    type: DataTypes.STRING,
    unique: true,
  },
  notUnique: {
    type: DataTypes.STRING,
  },
});
await sequelize.sync({force: true})
async function reset() {
  await Tag.truncate()
  await Tag.create({ name: 't0', name2: 's0', notUnique: 'a' })
}
await reset()
let tags, tagsFound

// Individual create does not have the option for some reason.
// Apparently you're just supposed to catch.
// https://github.com/sequelize/sequelize/issues/4513
//await Tag.create({name: 't0', ignoreDuplicates: true})

// SQLite: `INSERT OR IGNORE INTO` as desired
// PostgreSQL: `ON CONFLICT DO NOTHING` as desired
tags = await Tag.bulkCreate(
  [
    // Ignored due to t0 and s0 conflict.
    { name: 't0', name2: 's0', notUnique: 'a' },
    // Ignored due to t0 conflict alone.
    { name: 't0', name2: 's1', notUnique: 'a' },
    // Ignored due to s0 conflict alone.
    { name: 't1', name2: 's0', notUnique: 'a' },
    // Added.
    { name: 't1', name2: 's1', notUnique: 'a' },
    // Ignored due to conflict with previous..
    { name: 't1', name2: 's1', notUnique: 'a' },
    // Added.
    { name: 't2', name2: 's2', notUnique: 'a' },
  ],
  {
    ignoreDuplicates: true,
  }
)
tagsFound = await Tag.findAll({order: [['name', 'ASC']]})
assert.strictEqual(tagsFound[0].name, 't0')
assert.strictEqual(tagsFound[0].name2, 's0')
assert.strictEqual(tagsFound[1].name, 't1')
assert.strictEqual(tagsFound[1].name2, 's1')
assert.strictEqual(tagsFound[2].name, 't2')
assert.strictEqual(tagsFound[2].name2, 's2')
assert.strictEqual(tagsFound.length, 3)
await reset()

// Also exists for create.
// It is not documented however:
// https://sequelize.org/v6/class/src/model.js~Model.html
tags = await Tag.create(
  { name: 't0', name2: 's1', notUnique: 'a' },
  {
    ignoreDuplicates: true,
  }
)
tagsFound = await Tag.findAll({order: [['name', 'ASC']]})
assert.strictEqual(tagsFound[0].name, 't0')
assert.strictEqual(tagsFound[0].name2, 's0')
assert.strictEqual(tagsFound.length, 1)
await reset()

await sequelize.close();
})();
