#!/usr/bin/env node
// https://cirosantilli.com/sequelize-example
const assert = require('assert');
const path = require('path');
const { DataTypes } = require('sequelize');
const common = require('./common')
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {

// Create the tables.
const User = sequelize.define('User', {
  name: { type: DataTypes.STRING },
}, {});
const Post = sequelize.define('Post', {
  body: { type: DataTypes.STRING },
}, {});
// UserLikesPost is the name of the relation table.
// Sequelize creates it automatically for us.
// On SQLite that table looks like this:
// CREATE TABLE `UserLikesPost` (
//   `createdAt` DATETIME NOT NULL,
//   `updatedAt` DATETIME NOT NULL,
//   `UserId` INTEGER NOT NULL REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
//   `PostId` INTEGER NOT NULL REFERENCES `Posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
//   PRIMARY KEY (`UserId`, `PostId`)
// );
User.belongsToMany(Post, {through: 'UserLikesPost'});
Post.belongsToMany(User, {through: 'UserLikesPost'});
await sequelize.sync({force: true});

async function reset() {
  // The cascade: true is needed here otherwise `await User.truncate()` fails with:
  // ``
  // cannot truncate a table referenced in a foreign key constraint
  // ``
  // on PostgreSQL 13.4.
  // https://github.com/sequelize/sequelize/issues/11289
  // https://stackoverflow.com/questions/56700466/postgresql-truncate-table-with-foreign-key-constraint
  await sequelize.truncate({ cascade: true })

  // Create some users and likes.

  const user0 = await User.create({name: 'user0'})
  const user1 = await User.create({name: 'user1'})
  const user2 = await User.create({name: 'user2'})
  const post0 = await Post.create({body: 'post0'})
  const post1 = await Post.create({body: 'post1'})
  const post2 = await Post.create({body: 'post2'})

  // Autogenerated add* methods

  // Make user0 like post0
  await user0.addPost(post0)
  // Also works.
  //await user0.addPost(post0.id)
  // Make user0 and user2 like post1
  await post1.addUsers([user0, user2])

  return [user0, user1, user2, post0, post1, post2]
}
let [user0, user1, user2, post0, post1, post2] = await reset()
let rows;

// Autogenerated get* methods

// Get posts that a user likes.

const user0Likes = await user0.getPosts({order: [['body', 'ASC']])
assert.strictEqual(user0Likes[0].body, 'post0');
assert.strictEqual(user0Likes[1].body, 'post1');
assert.strictEqual(user0Likes.length, 2);
assert.strictEqual(await user0.countPosts(), 2)

const user1Likes = await user1.getPosts({order: [['body', 'ASC']]})
assert.strictEqual(user1Likes.length, 0);

const user2Likes = await user2.getPosts({order: [['body', 'ASC']]})
assert.strictEqual(user2Likes[0].body, 'post1');
assert.strictEqual(user2Likes.length, 1);

// Don't SELECT any attributes of the JOIN table with joinTableAttributes
// to be a bit more efficient. when we don't need that data.
//
// TODO I don't even know to how access that data when joinTableAttributes
// is not given. At many_to_many_custom_table.js, we are able to do that,
// but it doesn't seem to be populated when the implicit table is used.

const user0LikesNoJoin = await user0.getPosts({order: [['body', 'ASC']], joinTableAttributes: []})
assert.strictEqual(user0LikesNoJoin[0].body, 'post0');
assert.strictEqual(user0LikesNoJoin[1].body, 'post1');
assert.strictEqual(user0LikesNoJoin.length, 2);
assert.strictEqual(await user0.countPosts(), 2)

// Same as get but with the user ID instead of the model object.
{
  const user0Likes = await Post.findAll({
    include: [{
      model: User,
      where: {id: user0.id},
    }],
    order: [['body', 'ASC']],
  })
  assert.strictEqual(user0Likes[0].body, 'post0');
  assert.strictEqual(user0Likes[1].body, 'post1');
  assert.strictEqual(user0Likes.length, 2);
}

// Yet another way that can be more useful in nested includes.
{
  const user0Likes = (await User.findOne({
    where: {id: user0.id},
    include: [{
      model: Post,
    }],
    order: [[Post, 'body', 'ASC']],
  })).Posts
  assert.strictEqual(user0Likes[0].body, 'post0');
  assert.strictEqual(user0Likes[1].body, 'post1');
  assert.strictEqual(user0Likes.length, 2);
}

// Get users that liked a given post.

const post0Likers = await post0.getUsers({order: [['name', 'ASC']]})
assert.strictEqual(post0Likers[0].name, 'user0');
assert.strictEqual(post0Likers.length, 1);

const post1Likers = await post1.getUsers({order: [['name', 'ASC']]})
assert.strictEqual(post1Likers[0].name, 'user0');
assert.strictEqual(post1Likers[1].name, 'user2');
assert.strictEqual(post1Likers.length, 2);

const post2Likers = await post2.getUsers({order: [['name', 'ASC']]})
assert.strictEqual(post2Likers.length, 0);

// Autogenerated has* methods

// Check if user likes post.
assert( await user0.hasPost(post0))
assert( await user0.hasPost(post0.id)) // same
assert( await user0.hasPost(post1))
assert(!await user0.hasPost(post2))

// Check if post is liked by user.
assert( await post0.hasUser(user0))
assert(!await post0.hasUser(user1))
assert(!await post0.hasUser(user2))

// AND of multiple has checks at once.
assert( await user0.hasPosts([post0, post1]))
assert(!await user0.hasPosts([post0, post1, post2]))

// Autogenerated count* methods
assert.strictEqual(await user0.countPosts(), 2)
assert.strictEqual(await post0.countUsers(), 1)

// Count how many post each user likes: GROUP BY + COUNT aggregate.
// Order return by users with most likes first.
// INNER JOIN due to `required: true`, so 0 counts are not present.
rows = await User.findAll({
  attributes: [
    'name',
    [sequelize.fn('COUNT', '*'), 'count'],
  ],

  // Workaround for: https://github.com/sequelize/sequelize/issues/5481#issuecomment-964387232
  raw: true,
  includeIgnoreAttributes: false,

  include: [
    {
      model: Post,
      required: true,
    },
  ],
  group: ['User.name'],
  order: [[sequelize.col('count'), 'DESC']],
})
assert.strictEqual(rows[0].name, 'user0')
assert.strictEqual(parseInt(rows[0].count, 10), 2)
assert.strictEqual(rows[1].name, 'user2')
assert.strictEqual(parseInt(rows[1].count, 10), 1)
assert.strictEqual(rows.length, 2)

// Same as above, but LEFT OUTER JOIN + COUNT(column),
// so 0 counts will be present.
rows = await User.findAll({
  attributes: [
    'name',
    [sequelize.fn('COUNT', sequelize.col('Posts.id')), 'count'],
  ],
  raw: true,
  includeIgnoreAttributes: false,
  include: [
    {
      model: Post,
      required: false,
    },
  ],
  group: ['User.name'],
  order: [[sequelize.col('count'), 'DESC']],
})
assert.strictEqual(rows[0].name, 'user0')
assert.strictEqual(parseInt(rows[0].count, 10), 2)
assert.strictEqual(rows[1].name, 'user2')
assert.strictEqual(parseInt(rows[1].count, 10), 1)
assert.strictEqual(rows[2].name, 'user1')
assert.strictEqual(parseInt(rows[2].count, 10), 0)
assert.strictEqual(rows.length, 3)

// Autogenerated remove* methods

// user0 doesn't like post0 anymore.
await user0.removePost(post0)
// user0 and user 2 don't like post1 anymore.
await post1.removeUsers([user0, user2])
// Check that no-one likes anything anymore.
assert.strictEqual(await user0.countPosts(), 0)
assert.strictEqual(await post0.countUsers(), 0)
;[user0, user1, user2, post0, post1, post2] = await reset()

// Autogenerated create* method
// Create a new post and automatically make user0 like it.
const post3 = await user0.createPost({'body': 'post3'})
assert(await user0.hasPost(post3))
assert(await post3.hasUser(user0))
;[user0, user1, user2, post0, post1, post2] = await reset()

// Autogenerated set* method
// Make user0 like exactly these posts. Unlike anything else.
await user0.setPosts([post1, post2])
assert(!await user0.hasPost(post0))
assert( await user0.hasPost(post1))
assert( await user0.hasPost(post2))
assert(!await user0.hasPost(post3))
;[user0, user1, user2, post0, post1, post2] = await reset()

})().finally(() => { return sequelize.close() });
