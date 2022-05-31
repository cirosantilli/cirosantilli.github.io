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

  return [
    await IntegerNames.create({value: 2, name: 'two'}),
    await IntegerNames.create({value: 3, name: 'three'}),
    await IntegerNames.create({value: 5, name: 'five'}),
  ]
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
let i2, i3, i5
;[i2, i3, i5] = await reset()

let row, rows;

// SELECT all
rows = await IntegerNames.findAll({ order: [['value', 'ASC']] });
common.assertEqual(rows, [
  { id: 1, value: 2, name: 'two',   },
  { id: 2, value: 3, name: 'three', },
  { id: 3, value: 5, name: 'five',  },
])

// SELECT OFFSET without LIMIT. Non-SQL standard, but Sequelize implements it for us.
rows = await IntegerNames.findAll({ offset: 1, order: [['value', 'ASC']] });
common.assertEqual(rows, [
  { value: 3 },
  { value: 5 },
])

// ORDER as expression.
rows = await IntegerNames.findAll({ order: [[sequelize.fn('-', sequelize.col('value')), 'ASC']] });
common.assertEqual(rows, [
  { value: 5 },
  { value: 3 },
  { value: 2 },
])

// SELECT WHERE
rows = await IntegerNames.findAll({
  where: {
    value: 2
  },
  order: [['value', 'ASC']],
});
common.assertEqual(rows, [
  { id: 1, value: 2, name: 'two',   },
])

// SELECT WHERE IN
rows = await IntegerNames.findAll({
  where: {
    id: [1, 2],
  },
  order: [['value', 'ASC']],
});
common.assertEqual(rows, [
  { value: 2 },
  { value: 3 },
])

// It is a bit annoying though that it makes IN NULL queries when the list is empty.
rows = await IntegerNames.findAll({
  where: { id: [], },
});
common.assertEqual(rows, [])

// findOne: SELECT WHERE IN LIMIT 1
row = await IntegerNames.findOne({
  where: { value: { [Op.gt]: 2 }, },
  order: [['value', 'ASC']]
});
assert.strictEqual(row.value, 3);

// findByPk: SELECT WHERE IN id =
row = await IntegerNames.findByPk(i3.id)
assert.strictEqual(row.value, 3);

// findByPk: returns NULL if does not exist.
row = await IntegerNames.findByPk(666)
assert.strictEqual(row, null);

// attributes: SELECT only specified columns instead of the default of selecting all of them.
//
// Also rename value to myvalue with an AS.
//
// Also add a new demo calculated column.
//
// TODO why is get('myvalue') needed to get the value, only for the AS alias? Does not work with direct .myvalue access...
// https://stackoverflow.com/questions/45681000/sequelize-cannot-access-alias-alias-is-undefined
// Docs say they are the same however...
// https://web.archive.org/web/20210506230920/https://sequelize.org/master/class/lib/model.js~Model.html#static-method-getTableName
// ah, some of the docs say that you need .get(): https://github.com/sequelize/sequelize/issues/10592 terrible interface and docs as usual.
// https://stackoverflow.com/questions/32649218/how-do-i-select-a-column-using-an-alias
rows = await IntegerNames.findAll({
  attributes: [
    'name',
    // value AS myvalue
    ['value', 'myvalue'],
    // -value AS "myvalueMinus"
    [sequelize.fn('-', sequelize.col('value')), 'myvalueMinus'],
  ],
  where: {
    value: 2
  },
  order: [['value', 'ASC']],
});
common.assertEqual(rows, [
  { id: undefined, value: undefined, myvalue: 2, myvalueMinus: -2 },
])

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
rows = await IntegerNames.findAll({order: [['value', 'ASC']]})
common.assertEqual(rows, [
  { name: 'two'   },
  { name: 'five'  },
])
;[i2, i3, i5] = await reset()

// Truncate all tables.
// https://stackoverflow.com/questions/47816162/wipe-all-tables-in-a-schema-sequelize-nodejs/66985334#66985334
await sequelize.truncate();
assert.strictEqual(await IntegerNames.count(), 0);
;[i2, i3, i5] = await reset()

// bulkCreate
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
;[i2, i3, i5] = await reset()

// .close Otherwise it hangs for 10 seconds, it seems that it keeps the connection alive.
// https://stackoverflow.com/questions/28253831/recreating-database-sequelizejs-is-slow
// https://github.com/sequelize/sequelize/issues/8468
})().finally(() => { return sequelize.close() });
