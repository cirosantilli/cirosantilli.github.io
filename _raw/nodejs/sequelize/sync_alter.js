#!/usr/bin/env node

// https://stackoverflow.com/questions/17708620/sequelize-changing-model-schema-on-production

const assert = require('assert');
const path = require('path');
const { DataTypes } = require('sequelize');
const common = require('./common')
;(async () => {
{
  const sequelize = common.sequelize(__filename, process.argv[2])
  const IntegerNames = sequelize.define('IntegerNames', {
    value: { type: DataTypes.INTEGER, },
    name: { type: DataTypes.STRING, },
  }, {});
  await IntegerNames.sync({force: true})
  await IntegerNames.create({value: 2, name: 'two'});
  await IntegerNames.create({value: 3, name: 'three'});
  await sequelize.close();
}

// Alter by adding column..
{
  const sequelize = common.sequelize(__filename, process.argv[2])
  const IntegerNames = sequelize.define('IntegerNames', {
    value: { type: DataTypes.INTEGER, },
    name: { type: DataTypes.STRING, },
    nameEs: { type: DataTypes.STRING, },
  }, {});
  await IntegerNames.sync({alter: true})
  await IntegerNames.create({value: 5, name: 'five' , nameEs: 'cinco'});
  await IntegerNames.create({value: 7, name: 'seven', nameEs: 'siete'});
  const integerNames = await IntegerNames.findAll({
    order: [['value', 'ASC']],
  });
  assert.strictEqual(integerNames[0].value , 2);
  assert.strictEqual(integerNames[0].name  , 'two');
  assert.strictEqual(integerNames[0].nameEs, null);
  assert.strictEqual(integerNames[1].name  , 'three');
  assert.strictEqual(integerNames[1].nameEs, null);
  assert.strictEqual(integerNames[2].name  , 'five');
  assert.strictEqual(integerNames[2].nameEs, 'cinco');
  assert.strictEqual(integerNames[3].name  , 'seven');
  assert.strictEqual(integerNames[3].nameEs, 'siete');
  await sequelize.close();
}

// Alter by removing column. undefined instead of null,
// because the values really aren't present in the database anymore.
{
  const sequelize = common.sequelize(__filename, process.argv[2])
  const IntegerNames = sequelize.define('IntegerNames', {
    value: { type: DataTypes.INTEGER, },
    name: { type: DataTypes.STRING, },
  }, {});
  await IntegerNames.sync({alter: true})
  const integerNames = await IntegerNames.findAll({
    order: [['value', 'ASC']],
  });
  assert.strictEqual(integerNames[0].value , 2);
  assert.strictEqual(integerNames[0].name  , 'two');
  assert.strictEqual(integerNames[0].nameEs, undefined);
  assert.strictEqual(integerNames[1].name  , 'three');
  assert.strictEqual(integerNames[1].nameEs, undefined);
  assert.strictEqual(integerNames[2].name  , 'five');
  assert.strictEqual(integerNames[2].nameEs, undefined);
  assert.strictEqual(integerNames[3].name  , 'seven');
  assert.strictEqual(integerNames[3].nameEs, undefined);
  await sequelize.close();
}

// Alter a type.
// Hmm, docs suggest data would get dropped, but I only see typecast without alter.drop,
// so shy does it work still?. sqlite from CLI does confirm that it is now a VARCHAR(255)
// column.
{
  const sequelize = common.sequelize(__filename, process.argv[2])
  const IntegerNames = sequelize.define('IntegerNames', {
    value: { type: DataTypes.STRING, },
    name: { type: DataTypes.STRING, },
  }, {});
  await IntegerNames.sync({alter: true})
  const integerNames = await IntegerNames.findAll({
    order: [['value', 'ASC']],
  });
  assert.strictEqual(integerNames[0].value, '2');
  assert.strictEqual(integerNames[0].name , 'two');
  assert.strictEqual(integerNames[1].value, '3');
  assert.strictEqual(integerNames[1].name , 'three');
  assert.strictEqual(integerNames[2].value, '5');
  assert.strictEqual(integerNames[2].name , 'five');
  assert.strictEqual(integerNames[3].value, '7');
  assert.strictEqual(integerNames[3].name , 'seven');
  await sequelize.close();
}

})();
