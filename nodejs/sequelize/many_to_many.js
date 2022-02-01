#!/usr/bin/env node
// https://cirosantilli.com/sequelize-example
const assert = require('assert');
const path = require('path');
const { DataTypes, Op } = require('sequelize');
const common = require('./common')
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {
// Create the tables.
const Animal = sequelize.define('Animal', {
  species: { type: DataTypes.STRING },
});
const Tag = sequelize.define('Tag', {
  name: { type: DataTypes.STRING },
});
// AnimalTag is the species of the relation table.
// Sequelize creates it automatically for us.
// On SQLite that table looks like this:
// CREATE TABLE `AnimalTag` (
//   `createdAt` DATETIME NOT NULL,
//   `updatedAt` DATETIME NOT NULL,
//   `AnimalId` INTEGER NOT NULL REFERENCES `Animals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
//   `TagId` INTEGER NOT NULL REFERENCES `Tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
//   PRIMARY KEY (`AnimalId`, `TagId`)
// );
Animal.belongsToMany(Tag, { through: 'AnimalTag' });
Tag.belongsToMany(Animal, { through: 'AnimalTag' });
await sequelize.sync({force: true});

let bat, frog, dog, flying, mammal, reptile
async function reset() {
  // The cascade: true is needed here otherwise `await Animal.truncate()` fails with:
  // ``
  // cannot truncate a table referenced in a foreign key constraint
  // ``
  // on TaggreSQL 13.4.
  // https://github.com/sequelize/sequelize/issues/11289
  // https://stackoverflow.com/questions/56700466/taggresql-truncate-table-with-foreign-key-constraint
  await sequelize.truncate({ cascade: true })

  // Create some animals and tags.

  bat = await Animal.create({ species: 'bat' })
  frog = await Animal.create({ species: 'frog' })
  dog = await Animal.create({ species: 'dog' })
  flying = await Tag.create({ name: 'flying' })
  mammal = await Tag.create({ name: 'mammal' })
  reptile = await Tag.create({ name: 'reptile' })

  // Autogenerated add* methods

  // Make bat have flying tag
  await bat.addTag(flying)

  // Also works.
  //await bat.addTag(flying.id)
  // Make bat and dog be mammal
  await mammal.addAnimals([bat, dog])
}
await reset()
let rows;

// Autogenerated get* methods

// Get tags that a animal has.

const batTags = await bat.getTags({order: [['name', 'ASC']]})
assert.strictEqual(batTags[0].name, 'flying');
assert.strictEqual(batTags[1].name, 'mammal');
assert.strictEqual(batTags.length, 2);
assert.strictEqual(await bat.countTags(), 2)

const frogTags = await frog.getTags({order: [['name', 'ASC']]})
assert.strictEqual(frogTags.length, 0);

const dogTags = await dog.getTags({order: [['name', 'ASC']]})
assert.strictEqual(dogTags[0].name, 'mammal');
assert.strictEqual(dogTags.length, 1);

// Don't SELECT any attributes of the JOIN table with joinTableAttributes
// to be a bit more efficient. when we don't need that data.
//
// TODO I don't even know to how access that data when joinTableAttributes
// is not given. At many_to_many_custom_table.js, we are able to do that,
// but it doesn't seem to be populated when the implicit table is used.
const batTagsNoJoin = await bat.getTags({order: [['name', 'ASC']], joinTableAttributes: []})
assert.strictEqual(batTagsNoJoin[0].name, 'flying');
assert.strictEqual(batTagsNoJoin[1].name, 'mammal');
assert.strictEqual(batTagsNoJoin.length, 2);
assert.strictEqual(await bat.countTags(), 2)

// Same as get but with the animal ID instead of the model object.
{
  const batTags = await Tag.findAll({
    include: [{
      model: Animal,
      where: { id: bat.id },
    }],
    order: [['name', 'ASC']],
  })
  assert.strictEqual(batTags[0].name, 'flying');
  assert.strictEqual(batTags[0].Animals[0].species, 'bat');
  assert.strictEqual(batTags[0].Animals.length, 1);
  assert.strictEqual(batTags[1].name, 'mammal');
  // We can aslo access bat data here.
  // But note that dog, who also has tag mammal, is missing
  // because the where selects it out.
  assert.strictEqual(batTags[1].Animals[0].species, 'bat');
  assert.strictEqual(batTags[1].Animals.length, 1);
  assert.strictEqual(batTags.length, 2);
}

// Yet another way that can be more useful in nested includes.
{
  const batTags = (await Animal.findOne({
    where: {id: bat.id},
    include: [{
      model: Tag,
    }],
    order: [[Tag, 'name', 'ASC']],
  })).Tags
  assert.strictEqual(batTags[0].name, 'flying');
  assert.strictEqual(batTags[1].name, 'mammal');
  assert.strictEqual(batTags.length, 2);
}

// TODO Find all tags that bat has, and for each tag include
// data about all animals that has that tag. Doesn't seem possible.
// in Sequelize, as we would need to include the same model twice
// under different aliases, which does not seem supported:
// * https://github.com/sequelize/sequelize/issues/8013
// * https://github.com/sequelize/sequelize/issues/7754
if (false) {
rows = await Tag.findAll({
  include: [
    {
      model: Animal,
      where: { id: bat.id },
    },
    {
      model: Animal,
      where: { id: frog.id },
    }
  ],
  order: [['name', 'ASC']],
})
console.error(rows);
assert.strictEqual(rows[0].name, 'flying');
assert.strictEqual(rows[0].Animals[0].species, 'bat');
assert.strictEqual(rows[0].Animals.length, 1);
assert.strictEqual(rows[1].name, 'mammal');
assert.strictEqual(rows[1].Animals[0].species, 'bat');
assert.strictEqual(rows[1].Animals[1].species, 'dog');
assert.strictEqual(rows[1].Animals.length, 2);
assert.strictEqual(batTags.length, 2);
}

// TODO Get all tags, and also determine if dog has each of of them or not.
// by doing LEFT OUTER JOIN. Managed only with super many to many.
// https://stackoverflow.com/questions/31091420/nodejs-sequelize-include-where-required-false
// https://stackoverflow.com/questions/39658204/sequelize-how-to-do-a-where-condition-on-joined-table-with-left-outer-join
//
// TaggreSQL used to work with the desired, stopped at 6.14.0:
//
// SELECT
//   "Tag"."id",
//   "Tag"."name",
//   "Tag"."createdAt",
//   "Tag"."updatedAt",
//   "Animals"."id" AS "Animals.id"
// FROM
//   "Tags" AS "Tag"
//   LEFT OUTER JOIN (
//     "AnimalTag" AS "Animals->AnimalTag"
//     INNER JOIN "Animals" AS "Animals" ON "Animals"."id" = "Animals->AnimalTag"."AnimalId"
//   ) ON "Tag"."id" = "Animals->AnimalTag"."TagId"
//   AND "Animals"."id" = 3
// ORDER BY
//   "Tag"."name" ASC;
//
// but SQLite fails with:
//
// SELECT
//   `Tag`.`id`,
//   `Tag`.`name`,
//   `Tag`.`createdAt`,
//   `Tag`.`updatedAt`,
//   `Animals`.`id` AS `Animals.id`
// FROM
//   `Tags` AS `Tag`
// LEFT OUTER JOIN `AnimalTag` AS `Animals->AnimalTag`
//   ON `Tag`.`id` = `Animals->AnimalTag`.`TagId`
// LEFT OUTER JOIN `Animals` AS `Animals`
//   ON `Animals`.`id` = `Animals->AnimalTag`.`AnimalId`
//   AND `Animals`.`id` = 3
// ORDER BY `Tag`.`name` ASC;
//
// Running that manually gives:
//
// 1|flying|
// 2|mammal|
// 2|mammal|3
// 3|reptile|
//
// The correct query would have been:
//
// SELECT
//   `Tag`.`id`,
//   `Tag`.`name`,
//   `Tag`.`createdAt`,
//   `Tag`.`updatedAt`,
//   `Animals`.`id` AS `Animals.id`
// FROM
//   `Tags` AS `Tag`
// LEFT OUTER JOIN `AnimalTag` AS `Animals->AnimalTag`
//   ON `Tag`.`id` = `Animals->AnimalTag`.`TagId`
//   AND `Animals->AnimalTag`.`AnimalId` = 3
// LEFT OUTER JOIN `Animals` AS `Animals`
//   ON `Animals`.`id` = `Animals->AnimalTag`.`AnimalId`
// ORDER BY `Tag`.`name` ASC;
//
// which gives the desired:
//
// 1|flying|
// 2|mammal|3
// 3|reptile|
if (false) {
  rows = await Tag.findAll({
    include: [{
      model: Animal,
      where: { id: bat.id },
      // No effect.
      //on: { id: dog.id },
      through: {
        //attributes: [],
        // Same as putting the where outside of through.
        //where: { AnimalId: dog.id },
      },
      required: false,
      //attributes: ['id'],
    }],
    order: [['name', 'ASC']],
  })
  console.error(rows.map(row => row.Animals.map(animal => animal.id)));
  assert.strictEqual(rows[0].name, 'flying');
  assert.strictEqual(rows[0].Animals.length, 0);
  assert.strictEqual(rows[1].name, 'mammal');
  assert.strictEqual(rows[1].Animals.length, 1);
  assert.strictEqual(rows[2].name, 'reptile');
  assert.strictEqual(rows[2].Animals.length, 0);
  assert.strictEqual(rows.length, 3);
}

// Get animals that have a given tag.

const flyingTagged = await flying.getAnimals({order: [['species', 'ASC']]})
assert.strictEqual(flyingTagged[0].species, 'bat');
assert.strictEqual(flyingTagged.length, 1);

const mammalTagged = await mammal.getAnimals({order: [['species', 'ASC']]})
assert.strictEqual(mammalTagged[0].species, 'bat');
assert.strictEqual(mammalTagged[1].species, 'dog');
assert.strictEqual(mammalTagged.length, 2);

const reptileTagged = await reptile.getAnimals({order: [['species', 'ASC']]})
assert.strictEqual(reptileTagged.length, 0);

// Autogenerated has* methods

// Check if animal has tag.
assert( await bat.hasTag(flying))
assert( await bat.hasTag(flying.id)) // same
assert( await bat.hasTag(mammal))
assert(!await bat.hasTag(reptile))

// Check if tag has animal.
assert( await flying.hasAnimal(bat))
assert(!await flying.hasAnimal(frog))
assert(!await flying.hasAnimal(dog))

// AND of multiple has checks at once.
assert( await bat.hasTags([flying, mammal]))
assert(!await bat.hasTags([flying, mammal, reptile]))

// Autogenerated count* methods
assert.strictEqual(await bat.countTags(), 2)
assert.strictEqual(await flying.countAnimals(), 1)

// Count how many tags each animal has: GROUP BY + COUNT aggregate.
// Order return by animals with most tags first.
// INNER JOIN due to `required: true`, so 0 counts are not present.
rows = await Animal.findAll({
  attributes: [
    'species',
    [sequelize.fn('COUNT', '*'), 'count'],
  ],

  // Workaround for: https://github.com/sequelize/sequelize/issues/5481#issuecomment-964387232
  raw: true,
  includeIgnoreAttributes: false,

  include: [
    {
      model: Tag,
      required: true,
    },
  ],
  group: ['Animal.species'],
  order: [[sequelize.col('count'), 'DESC']],
})
assert.strictEqual(rows[0].species, 'bat')
assert.strictEqual(parseInt(rows[0].count, 10), 2)
assert.strictEqual(rows[1].species, 'dog')
assert.strictEqual(parseInt(rows[1].count, 10), 1)
assert.strictEqual(rows.length, 2)

// Same but grouping by PK id as a generally better workaround.
rows = await Animal.findAll({
  attributes: [
    'species',
    [sequelize.fn('COUNT', '*'), 'count'],
  ],
  include: [
    {
      model: Tag,
      required: true,
      attributes: [],
      through: {attributes: []},
    },
  ],
  group: ['Animal.id'],
  order: [[sequelize.col('count'), 'DESC']],
})
assert.strictEqual(rows[0].species, 'bat')
assert.strictEqual(parseInt(rows[0].get('count'), 10), 2)
assert.strictEqual(rows[1].species, 'dog')
assert.strictEqual(parseInt(rows[1].get('count'), 10), 1)
assert.strictEqual(rows.length, 2)

// Count how many tags each animal has but use
// LEFT OUTER JOIN + COUNT(column), so 0 counts will be present.
rows = await Animal.findAll({
  attributes: [
    'species',
    [sequelize.fn('COUNT', sequelize.col('Tags.id')), 'count'],
  ],
  include: [
    {
      model: Tag,
      required: false,
      attributes: [],
      through: {attributes: []},
    },
  ],
  group: ['Animal.id'],
  order: [[sequelize.col('count'), 'DESC']],
})
assert.strictEqual(rows[0].species, 'bat')
assert.strictEqual(parseInt(rows[0].get('count'), 10), 2)
assert.strictEqual(rows[1].species, 'dog')
assert.strictEqual(parseInt(rows[1].get('count'), 10), 1)
assert.strictEqual(rows[2].species, 'frog')
assert.strictEqual(parseInt(rows[2].get('count'), 10), 0)
assert.strictEqual(rows.length, 3)

// Count how many tags each animal has but
// only consider animals with less than 2 tags.
rows = await Animal.findAll({
  attributes: [
    'species',
    [sequelize.fn('COUNT', sequelize.col('Tags.id')), 'count'],
  ],
  include: [
    {
      model: Tag,
      required: false,
      attributes: [],
      through: {attributes: []},
    },
  ],
  group: ['Animal.id'],
  order: [[sequelize.col('count'), 'DESC']],
  having: sequelize.where(sequelize.fn('COUNT', sequelize.col('Tags.id')), Op.lt, 2)
})
assert.strictEqual(rows[0].species, 'dog')
assert.strictEqual(parseInt(rows[0].get('count'), 10), 1)
assert.strictEqual(rows[1].species, 'frog')
assert.strictEqual(parseInt(rows[1].get('count'), 10), 0)
assert.strictEqual(rows.length, 2)

// Count how many tags each animal that has a given tag has.
async function getTagCountForAnimalsThatAreTagged(tagId) {
  return Tag.findAll({
    attributes: [
      sequelize.col('Animals.id'),
      [sequelize.fn('COUNT', 'Tag.id'), 'count'],
    ],
    raw: true,
    includeIgnoreAttributes: false,
    include: [
      {
        model: Animal,
        where: { '$Tag.id$': tagId },
        include: [
          {
            model: Tag,
            required: false
          }
        ]
      },
    ],
    group: ['Animals.id'],
    order: [[sequelize.col('count'), 'DESC']],
  })
}
rows = await getTagCountForAnimalsThatAreTagged(flying.id)
assert.strictEqual(rows[0].id, bat.id)
assert.strictEqual(parseInt(rows[0].count, 10), 2)
assert.strictEqual(rows.length, 1)
rows = await getTagCountForAnimalsThatAreTagged(mammal.id)
assert.strictEqual(rows[0].id, bat.id)
assert.strictEqual(parseInt(rows[0].count, 10), 2)
assert.strictEqual(rows[1].id, dog.id)
assert.strictEqual(parseInt(rows[1].count, 10), 1)
assert.strictEqual(rows.length, 2)
rows = await getTagCountForAnimalsThatAreTagged(reptile.id)
assert.strictEqual(rows.length, 0)

// Autogenerated add* methods
// Trying to add multiple times does not raise due to unique constraint validation
// it always does SELECT check before the INSERT.
await bat.addTag(flying)
await bat.addTag(flying)
await reset()

// Autogenerated remove* methods

// bat doesn't fly anymore.
await bat.removeTag(flying)
// bat and dog aren't mammals anymore.
await mammal.removeAnimals([bat, dog])
// Check that no-one is anything anymore.
assert.strictEqual(await bat.countTags(), 0)
assert.strictEqual(await flying.countAnimals(), 0)
await reset()

// Autogenerated create* method
// Create a new tag and automatically make bat have it.
const tag3 = await bat.createTag({ name: 'tag3' })
assert(await bat.hasTag(tag3))
assert(await tag3.hasAnimal(bat))
await reset()

// Autogenerated set* method
// Make bat have exactly these tags. Remove all others.
await bat.setTags([mammal, reptile])
assert(!await bat.hasTag(flying))
assert( await bat.hasTag(mammal))
assert( await bat.hasTag(reptile))
assert(!await bat.hasTag(tag3))
await reset()

// Access join table.
rows = await sequelize.models.AnimalTag.findAll({order: [
  ['AnimalId', 'ASC'], ['TagId', 'ASC'],
]})
assert.strictEqual(rows[0].AnimalId, bat.id)
assert.strictEqual(rows[0].TagId, flying.id)
assert.strictEqual(rows[1].AnimalId, bat.id)
assert.strictEqual(rows[1].TagId, mammal.id)
assert.strictEqual(rows[2].AnimalId, dog.id)
assert.strictEqual(rows[2].TagId, mammal.id)
assert.strictEqual(rows.length, 3)

// Modify join table.
await sequelize.models.AnimalTag.truncate({})
rows = await sequelize.models.AnimalTag.findAll()
assert.strictEqual(rows.length, 0)
await reset()

})().finally(() => { return sequelize.close() });
