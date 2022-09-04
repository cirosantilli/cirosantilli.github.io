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
    myValue: {
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
await Inverses.sync({ force: true })
async function reset() {
  await sequelize.truncate({ cascade: true })
  await Inverses.create({ myValue: 2, inverse: -2, name: 'two' });
  await Inverses.create({ myValue: 3, inverse: -3, name: 'three' });
  await Inverses.create({ myValue: 5, inverse: -5, name: 'five' });
}
await reset()
let rows

// Initial state.
rows = await Inverses.findAll({ order: [['myValue', 'ASC']]})
common.assertEqual(rows, [
  { myValue: 2, inverse: -2, name: 'two'   },
  { myValue: 3, inverse: -3, name: 'three' },
  { myValue: 5, inverse: -5, name: 'five'  },
])

// Update to fixed myValue.
await Inverses.update(
  { inverse: 0, },
  { where: { myValue: { [Op.gt]: 2 } } },
);
rows = await Inverses.findAll({ order: [['myValue', 'ASC']]})
common.assertEqual(rows, [
  { myValue: 2, inverse: -2, name: 'two'   },
  { myValue: 3, inverse:  0, name: 'three' },
  { myValue: 5, inverse:  0, name: 'five'  },
])
await reset()

// Update to match another column.
await Inverses.update(
  { inverse: sequelize.col('myValue'), },
  { where: { myValue: { [Op.gt]: 2 } } },
);
rows = await Inverses.findAll({ order: [['myValue', 'ASC']]})
common.assertEqual(rows, [
  { myValue: 2, inverse: -2, name: 'two'   },
  { myValue: 3, inverse:  3, name: 'three' },
  { myValue: 5, inverse:  5, name: 'five'  },
])
await reset()

// Update to match another column with modification.
// https://stackoverflow.com/questions/55646233/updating-with-calculated-values-in-sequelize
await Inverses.update(
  { inverse: sequelize.fn('1 + ', sequelize.col('myValue')), },
  { where: { myValue: { [Op.gt]: 2 } } },
);
rows = await Inverses.findAll({ order: [['myValue', 'ASC']]})
common.assertEqual(rows, [
  { myValue: 2, inverse: -2, name: 'two'   },
  { myValue: 3, inverse:  4, name: 'three' },
  { myValue: 5, inverse:  6, name: 'five'  },
])
await reset()

// A string function test.
await Inverses.update(
  { name: sequelize.fn('upper', sequelize.col('name')), },
  { where: { myValue: { [Op.gt]: 2 } } },
);
rows = await Inverses.findAll({ order: [['myValue', 'ASC']]})
common.assertEqual(rows, [
  { myValue: 2, inverse: -2, name: 'two'   },
  { myValue: 3, inverse: -3, name: 'THREE' },
  { myValue: 5, inverse: -5, name: 'FIVE'  },
])
await reset()

// Operator without parenthesis, e.g. col1 + col2. Possible with the "where" hack mentioned at:
// https://stackoverflow.com/questions/39946586/sequelize-sum-between-two-columns-in-model/62493655#62493655
// but that is so ugly I wonder if I should just use literal instead.
// * https://stackoverflow.com/questions/39946586/sequelize-sum-between-two-columns-in-model
// * https://stackoverflow.com/questions/48778789/addition-and-subtraction-assignment-operator-with-sequelize
await Inverses.update(
  { inverse: sequelize.where(sequelize.col('myValue'), '*', sequelize.col('inverse')), },
  { where: { myValue: { [Op.gt]: 2 } } },
);
rows = await Inverses.findAll({ order: [['myValue', 'ASC']]})
common.assertEqual(rows, [
  { myValue: 2, inverse:  -2, name: 'two'   },
  { myValue: 3, inverse:  -9, name: 'three' },
  { myValue: 5, inverse: -25, name: 'five'  },
])
await reset()

// Equivalent literal version.
// We have to manually quote for PostgreSQL because of the upper case V.
await Inverses.update(
  { inverse: sequelize.literal('"myValue" * "inverse"'), },
  { where: { myValue: { [Op.gt]: 2 } } },
);
rows = await Inverses.findAll({ order: [['myValue', 'ASC']]})
common.assertEqual(rows, [
  { myValue: 2, inverse:  -2, name: 'two'   },
  { myValue: 3, inverse:  -9, name: 'three' },
  { myValue: 5, inverse: -25, name: 'five'  },
])
await reset()

// With a literal multiplier instead.
await Inverses.update(
  { inverse: sequelize.where(sequelize.col('myValue'), '*', -2), },
  { where: { myValue: { [Op.gt]: 2 } } },
);
rows = await Inverses.findAll({ order: [['myValue', 'ASC']]})
common.assertEqual(rows, [
  { myValue: 2, inverse:  -2, name: 'two'   },
  { myValue: 3, inverse:  -6, name: 'three' },
  { myValue: 5, inverse: -10, name: 'five'  },
])
await reset()

})().finally(() => { return sequelize.close() });
