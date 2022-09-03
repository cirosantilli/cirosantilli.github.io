#!/usr/bin/env node

// https://cirosantilli.com/sequelize-example

const assert = require('assert');
const path = require('path');
const { DataTypes } = require('sequelize');
const common = require('./common')
const sequelize = common.sequelize(__filename, process.argv[2], { define: { timestamps: false } })
;(async () => {
const Integer = sequelize.define('Integer',
  {
    value: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    inverse: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);
await Integer.sync({ force: true })
await Integer.create({ value: 2, inverse: -2, name: 'two'   });
await Integer.create({ value: 3, inverse: -3, name: 'three' });
await Integer.create({ value: 5, inverse: -5, name: 'five'  });
let rows

// Initial state.
rows = await Integer.findAll({ order: [['id', 'ASC']]})
common.assertEqual(rows, [
  { id: 1, value: 2, name: 'two',   inverse: -2 },
  { id: 2, value: 3, name: 'three', inverse: -3 },
  { id: 3, value: 5, name: 'five',  inverse: -5 },
])

// Update existing rows.
rows = [(await Integer.upsert({ value: 2, name: 'TWO' }))[0]]
if (sequelize.options.dialect === 'postgres') {
  common.assertEqual(rows, [
    { id: 1, value: 2, name: 'TWO', inverse: -2 },
  ])
} else {
  // Unexpected ID returned due to the lack of RETURNING, we wanted it to be 1.
  common.assertEqual(rows, [
    { id: 3, value: 2, name: 'TWO', inverse: undefined },
  ])
}
rows = [(await Integer.upsert({ value: 3, name: 'THREE' }))[0]]
if (sequelize.options.dialect === 'postgres') {
  common.assertEqual(rows, [
    { id: 2, value: 3, name: 'THREE', inverse: -3 },
  ])
} else {
  common.assertEqual(rows, [
    { id: 3, value: 3, name: 'THREE', inverse: undefined },
  ])
}

// Insert a new item with upsert.
rows = [(await Integer.upsert({ value: 7, name: 'SEVEN' }))[0]]
if (sequelize.options.dialect === 'postgres') {
  common.assertEqual(rows, [
    { id: 6, value: 7, name: 'SEVEN',  inverse: null },
  ])
} else {
  common.assertEqual(rows, [
    { id: 6, value: 7, name: 'SEVEN', inverse: undefined },
  ])
}

// Final state.
rows = await Integer.findAll({ order: [['value', 'ASC']]})
common.assertEqual(rows, [
  { id: 1, value: 2, name: 'TWO',    inverse: -2 },
  { id: 2, value: 3, name: 'THREE',  inverse: -3 },
  { id: 3, value: 5, name: 'five',   inverse: -5 },
  { id: 6, value: 7, name: 'SEVEN',  inverse: null },
])

})().finally(() => { return sequelize.close() });
