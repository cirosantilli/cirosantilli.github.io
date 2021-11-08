#!/usr/bin/env node

// https://cirosantilli.com/sequelize-example

const assert = require('assert');
const path = require('path');

const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'tmp.' + path.basename(__filename) + '.sqlite',
});

(async () => {

// Datetime. Automatically converts to/from date objects.
const Dates = sequelize.define('Dates', {
  date: {
    type: DataTypes.DATE,
  },
}, {});
await Dates.sync({force: true})
let dateCreate = await Dates.create({date: new Date(2000, 0, 1, 2, 3, 4, 5)});
await Dates.create({date: new Date(2000, 0, 1, 2, 3, 4, 6)});
await Dates.create({date: new Date(2000, 0, 1, 2, 3, 4, 7)});
let date = await Dates.findOne({
  order: [
    ['date', 'ASC'],
  ],
});
assert.strictEqual(date.date.getTime(), new Date(2000, 0, 1, 2, 3, 4, 5).getTime());
assert.strictEqual(date.date.getTime(), dateCreate.date.getTime());
await sequelize.close();
})();


