#!/usr/bin/env node

// https://cirosantilli.com/sequelize-example

const assert = require('assert');
const path = require('path');
const { DataTypes, Op } = require('sequelize');
const common = require('./common')
const sequelize = common.sequelize(__filename, process.argv[2], { define: { timestamps: false } })
;(async () => {
const Inverses = sequelize.define('Inverses',
  {
    value: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    inverse: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false }
);
await Inverses.sync({force: true})
await Inverses.create({value: 2, inverse: -2, name: 'two'});
await Inverses.create({value: 3, inverse: -3, name: 'three'});
await Inverses.create({value: 5, inverse: -5, name: 'five'});

// Initial state.
assert.strictEqual((await Inverses.findOne({ where: { value: 2 } })).inverse, -2);
assert.strictEqual((await Inverses.findOne({ where: { value: 3 } })).inverse, -3);
assert.strictEqual((await Inverses.findOne({ where: { value: 5 } })).inverse, -5);
assert.strictEqual((await Inverses.findOne({ where: { value: 2 } })).name, 'two');
assert.strictEqual((await Inverses.findOne({ where: { value: 3 } })).name, 'three');
assert.strictEqual((await Inverses.findOne({ where: { value: 5 } })).name, 'five');
assert.strictEqual(await Inverses.count(), 3);

// Update to fixed value.
await Inverses.update(
  { inverse: 0, },
  { where: { value: { [Op.gt]: 2 } } },
);
assert.strictEqual((await Inverses.findOne({ where: { value: 2 } })).inverse, -2);
assert.strictEqual((await Inverses.findOne({ where: { value: 3 } })).inverse, 0);
assert.strictEqual((await Inverses.findOne({ where: { value: 5 } })).inverse, 0);
assert.strictEqual(await Inverses.count(), 3);

// Update to match another column.
await Inverses.update(
  { inverse: sequelize.col('value'), },
  { where: { value: { [Op.gt]: 2 } } },
);
assert.strictEqual((await Inverses.findOne({ where: { value: 2 } })).inverse, -2);
assert.strictEqual((await Inverses.findOne({ where: { value: 3 } })).inverse, 3);
assert.strictEqual((await Inverses.findOne({ where: { value: 5 } })).inverse, 5);
assert.strictEqual(await Inverses.count(), 3);

// Update to match another column with modification.
//
// TODO operator without parenthesis, e.g. col1 + col2??? Impossible without literals?
// * https://stackoverflow.com/questions/39946586/sequelize-sum-between-two-columns-in-model
// * https://stackoverflow.com/questions/48778789/addition-and-subtraction-assignment-operator-with-sequelize
await Inverses.update(
  { inverse: sequelize.fn('1 + ', sequelize.col('value')), },
  { where: { value: { [Op.gt]: 2 } } },
);
assert.strictEqual((await Inverses.findOne({ where: { value: 2 } })).inverse, -2);
assert.strictEqual((await Inverses.findOne({ where: { value: 3 } })).inverse, 4);
assert.strictEqual((await Inverses.findOne({ where: { value: 5 } })).inverse, 6);
assert.strictEqual(await Inverses.count(), 3);

// A string function test.
await Inverses.update(
  { name: sequelize.fn('upper', sequelize.col('name')), },
  { where: { value: { [Op.gt]: 2 } } },
);
assert.strictEqual((await Inverses.findOne({ where: { value: 2 } })).name, 'two');
assert.strictEqual((await Inverses.findOne({ where: { value: 3 } })).name, 'THREE');
assert.strictEqual((await Inverses.findOne({ where: { value: 5 } })).name, 'FIVE');
assert.strictEqual(await Inverses.count(), 3);

})().finally(() => { return sequelize.close() });
