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
      unique: true, // mandatory
    },
    name: {
      type: DataTypes.STRING,
    },
    inverse: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

// Update.
rows = await Integer.bulkCreate(
  [
    { value: 2, name: 'TWO'   },
    { value: 3, name: 'THREE' },
    { value: 7, name: 'SEVEN' },
  ],
  { updateOnDuplicate: ["name"] }
)
// PostgreSQL runs the desired:
//
// INSERT INTO "Integers" ("id","value","name") VALUES (DEFAULT,2,'TWO'),(DEFAULT,3,'THREE'),(DEFAULT,7,'SEVEN') ON CONFLICT ("value") DO UPDATE SET "name"=EXCLUDED."name" RETURNING "id","value","name","inverse";
//
// but "sequelize": "6.14.0" "sqlite3": "5.0.2" does not use the desired RETURNING which was only added in 3.35.0 2021: https://www.sqlite.org/lang_returning.html
//
// INSERT INTO `Integers` (`id`,`value`,`name`) VALUES (NULL,2,'TWO'),(NULL,3,'THREE'),(NULL,7,'SEVEN') ON CONFLICT (`value`) DO UPDATE SET `name`=EXCLUDED.`name`;
//
// so not sure how it returns any IDs at all, is it just incrementing them manually? In any case, those IDs are
// all wrong as they don't match the final database state, Likely RETURNING will be added at some point.
//
// * https://stackoverflow.com/questions/29063232/sequelize-upsert
// * https://github.com/sequelize/sequelize/issues/7478
// * https://github.com/sequelize/sequelize/issues/12426
// * https://github.com/sequelize/sequelize/issues/3354
if (sequelize.options.dialect === 'postgres') {
  common.assertEqual(rows, [
    { id: 1, value: 2, name: 'TWO',   inverse: -2 },
    { id: 2, value: 3, name: 'THREE', inverse: -3 },
    // The 6 here seems to be because the new TWO and THREE initially take up dummy rows,
    // but are finally restored to final values.
    { id: 6, value: 7, name: 'SEVEN',  inverse: null },
  ])
} else {
  common.assertEqual(rows, [
    // These IDs are just completely wrong as mentioned at: https://github.com/sequelize/sequelize/issues/12426
    // Will be fixed when one day they use RETURNING.
    { id: 4, value: 2, name: 'TWO',   inverse: undefined },
    { id: 5, value: 3, name: 'THREE', inverse: undefined },
    { id: 6, value: 7, name: 'SEVEN', inverse: undefined },
  ])
}

// Final state.
rows = await Integer.findAll({ order: [['id', 'ASC']]})
common.assertEqual(rows, [
  { id: 1, value: 2, name: 'TWO',    inverse: -2 },
  { id: 2, value: 3, name: 'THREE',  inverse: -3 },
  { id: 3, value: 5, name: 'five',   inverse: -5 },
  { id: 6, value: 7, name: 'SEVEN',  inverse: null },
])

})().finally(() => { return sequelize.close() });
