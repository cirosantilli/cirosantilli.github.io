#!/usr/bin/env node

// https://cirosantilli.com/sequelize-example

const assert = require('assert');
const path = require('path');
const { DataTypes, Op } = require('sequelize');
const common = require('./common')
const sequelize = common.sequelize(__filename, process.argv[2], { define: { timestamps: false } })
;(async () => {
const Country = sequelize.define('Country', {
  country_name: { type: DataTypes.STRING, unique: true },
});
const City = sequelize.define('City', {
  parent_country: { type: DataTypes.STRING },
  city_name: { type: DataTypes.STRING },
});
Country.hasMany(City, { foreignKey: 'parent_country', sourceKey: 'country_name' })
City.belongsTo(Country, { foreignKey: 'parent_country', targetKey: 'country_name' })
async function reset() {
  await sequelize.sync({force: true});
  await Country.create({country_name: 'germany'})
  await Country.create({country_name: 'france'})
  await City.create({parent_country: 'germany', city_name: 'berlin'});
  await City.create({parent_country: 'germany', city_name: 'munich'});
  await City.create({parent_country: 'france', city_name: 'paris'});
}
await reset()

{
  const rows = await City.findAll({
    where: { parent_country: 'germany' },
    include: {
			model: Country,
    }
  });
	assert.strictEqual(rows[0].Country.country_name, 'germany')
	assert.strictEqual(rows[1].Country.country_name, 'germany')
	assert.strictEqual(rows.length, 2)
}
})().finally(() => { return sequelize.close() });
