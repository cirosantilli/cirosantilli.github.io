#!/usr/bin/env node
// https://cirosantilli.com/sequelize-example
const assert = require('assert')
const { DataTypes, Op } = require('sequelize')
const common = require('./common')
const sequelize = common.sequelize(__filename, process.argv[2])

// OMG fuck this asynchronous bullshit:
// https://stackoverflow.com/questions/39928452/execute-sequelize-queries-synchronously/43250120
;(async () => {

// Connection sanity check.
// https://stackoverflow.com/questions/19429152/check-mysql-connection-in-sequelize/31115934
await sequelize.authenticate();

const IntegerNames = sequelize.define('IntegerNames', {
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
  },
});

// Create the database defined by `sequelize.define`.
await IntegerNames.sync({force: true})
// After this:
//
// psql lkmc-nodejs -c '\dt'
//
// gives:
//
//            List of relations
//  Schema |     Name     | Type  | Owner
// --------+--------------+-------+-------
//  public | IntegerNames | table | ciro
// (2 rows)
//
// and:
//
// psql lkmc-nodejs -c '\d+ "IntegerNames"'
//
// gives:
//
//   Column   |           Type           | Collation | Nullable |                  Default                   | Storage  | Stats target | Description
// -----------+--------------------------+-----------+----------+--------------------------------------------+----------+--------------+-------------
//  id        | integer                  |           | not null | nextval('"IntegerNames_id_seq"'::regclass) | plain    |              |
//  value     | integer                  |           | not null |                                            | plain    |              |
//  name      | character varying(255)   |           |          |                                            | extended |              |
//  createdAt | timestamp with time zone |           | not null |                                            | plain    |              |
//  updatedAt | timestamp with time zone |           | not null |                                            | plain    |              |
// Indexes:
//     "IntegerNames_pkey" PRIMARY KEY, btree (id)

async function reset() {
  // First clean the database to properly reset data after we modify data in our tests.
  await sequelize.truncate({ cascade: true })

  await IntegerNames.create({value: 2, name: 'two'});
  await IntegerNames.create({value: 3, name: 'three'});
  await IntegerNames.create({value: 5, name: 'five'});
  // psql lkmc-nodejs -c 'SELECT * FROM "IntegerNames";'
  //
  // gives:
  //
  //  id | value | name  |         createdAt          |         updatedAt
  // ----+-------+-------+----------------------------+----------------------------
  //   1 |     2 | two   | 2021-03-19 19:12:08.436+00 | 2021-03-19 19:12:08.436+00
  //   2 |     3 | three | 2021-03-19 19:12:08.436+00 | 2021-03-19 19:12:08.436+00
  //   3 |     5 | five  | 2021-03-19 19:12:08.437+00 | 2021-03-19 19:12:08.437+00
  // (3 rows)
}
let i = await IntegerNames.findOne();
await reset()

let integerNames;

// SELECT all
integerNames = await IntegerNames.findAll();
assert.strictEqual(integerNames[0].id, 1);
assert.strictEqual(integerNames[0].name, 'two');
assert.strictEqual(integerNames[0].value, 2);
assert.strictEqual(integerNames[1].id, 2);
assert.strictEqual(integerNames[1].name, 'three');
assert.strictEqual(integerNames[1].value, 3);
assert.strictEqual(integerNames[2].id, 3);
assert.strictEqual(integerNames[2].name, 'five');
assert.strictEqual(integerNames[2].value, 5);
assert.strictEqual(integerNames.length, 3);

// SELECT OFFSET without LIMIT. Non-SQL standard, but Sequelize implements it for us.
integerNames = await IntegerNames.findAll({ offset: 1 });
assert.strictEqual(integerNames[0].value, 3);
assert.strictEqual(integerNames[1].value, 5);
assert.strictEqual(integerNames.length, 2);

// SELECT WHERE
integerNames = await IntegerNames.findAll({
  where: {
    value: 2
  }
});
assert.strictEqual(integerNames[0].id, 1);
assert.strictEqual(integerNames[0].name, 'two');
assert.strictEqual(integerNames[0].value, 2);
assert.strictEqual(integerNames.length, 1);

// SELECT WHERE IN
integerNames = await IntegerNames.findAll({
  where: {
    id: [1, 2],
  }
});
assert.strictEqual(integerNames[0].value, 2);
assert.strictEqual(integerNames[1].value, 3);
assert.strictEqual(integerNames.length, 2);

// It is a bit annoying though that it makes IN NULL queries when the list is empty.
integerNames = await IntegerNames.findAll({
  where: { id: [], }
});
assert.strictEqual(integerNames.length, 0);

// attributes: SELECT only specified columns instead of the default of selecting all of them.
// Rename value to myvalue
//
// TODO why is get('myvalue') needed to get the value? Does not work with direct .myvalue access...
// https://stackoverflow.com/questions/45681000/sequelize-cannot-access-alias-alias-is-undefined
// Docs say they are the same however...
// https://web.archive.org/web/20210506230920/https://sequelize.org/master/class/lib/model.js~Model.html#static-method-getTableName
// ah, some of the docs say that you need .get(): https://github.com/sequelize/sequelize/issues/10592 terrible interface and docs as usual.
// https://stackoverflow.com/questions/32649218/how-do-i-select-a-column-using-an-alias
integerNames = await IntegerNames.findAll({
  attributes: [
    'name',
    ['value', 'myvalue'],
  ],
  where: {
    value: 2
  }
});
assert.strictEqual(integerNames[0].id, undefined);
assert.strictEqual(integerNames[0].name, 'two');
assert.strictEqual(integerNames[0].value, undefined);
assert.strictEqual(integerNames[0].get('myvalue'), 2);
assert.strictEqual(integerNames.length, 1);

// DELETE WHERE: https://stackoverflow.com/questions/8402597/sequelize-js-delete-query
await IntegerNames.destroy({
  where: {
    value: { [Op.gt]: 2 },
  },
  // The LIMIT requires a subquery in many DBMS e.g. SQLite and PostgreSQL,
  // as it is not SQL standard. But sequelize does implement for us.
  // It does not implement offset however, although that would be trivial:
  // https://stackoverflow.com/questions/56377593/complex-destroy-query
  limit: 1,
});
integerNames = await IntegerNames.findAll({order: [['value', 'ASC']]})
assert.strictEqual(integerNames[0].name, 'two');
assert.strictEqual(integerNames[1].name, 'five');
assert.strictEqual(integerNames.length, 2);
await reset()

// Truncate all tables.
// https://stackoverflow.com/questions/47816162/wipe-all-tables-in-a-schema-sequelize-nodejs/66985334#66985334
await sequelize.truncate();
assert.strictEqual(await IntegerNames.count(), 0);
await reset()

// bulkdreate
await sequelize.truncate();
const date = new Date(2000, 0, 1, 2, 3, 4, 5)
await IntegerNames.bulkCreate([
  { value: 2, name: 'two'  , createdAt: date, updatedAt: date },
  { value: 3, name: 'three', createdAt: date, updatedAt: date },
  { value: 5, name: 'five' , createdAt: date, updatedAt: date },
])
rows = await IntegerNames.findAll({order: [['value', 'ASC']]})
// Check that they get updated.
// https://stackoverflow.com/questions/42519583/sequelize-updating-updatedat-manually
// https://github.com/sequelize/sequelize/issues/3759
// https://stackoverflow.com/questions/69053635/in-sequelize-bulkcreate-timestamps-are-not-updating
// https://github.com/sequelize/sequelize/issues/6992
assert.strictEqual(rows[0].createdAt.getTime(), date.getTime())
assert.strictEqual(rows[0].updatedAt.getTime(), date.getTime())
await reset()

// .close Otherwise it hangs for 10 seconds, it seems that it keeps the connection alive.
// https://stackoverflow.com/questions/28253831/recreating-database-sequelizejs-is-slow
// https://github.com/sequelize/sequelize/issues/8468
})().finally(() => { return sequelize.close() });