#!/usr/bin/env node
// https://cirosantilli.com/sequelize-example
const assert = require('assert');
const path = require('path');
const { DataTypes, Op } = require('sequelize');
const common = require('./common')
const sequelize = common.sequelize(
  __filename, process.argv[2],
  { define: { timestamps: false } }
)
;(async () => {
// Create the tables.

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING },
});
const Post = sequelize.define('Post', {
  body: { type: DataTypes.STRING },
});
const UserLikesPost = sequelize.define('UserLikesPost')
UserLikesPost.belongsTo(User)
User.hasMany(UserLikesPost)
UserLikesPost.belongsTo(Post)
Post.hasMany(UserLikesPost)
User.belongsToMany(Post, { through: UserLikesPost });
Post.belongsToMany(User,{ through: UserLikesPost });

await sequelize.sync({ force: true });

async function reset() {
  await sequelize.truncate({ cascade: true })
  const user0 = await User.create({ name: 'user0' })
  const user1 = await User.create({ name: 'user1' })
  const user2 = await User.create({ name: 'user2' })
  const post0 = await Post.create({ body: 'post0' })
  const post1 = await Post.create({ body: 'post1' })
  const post2 = await Post.create({ body: 'post2' })
  await user0.addPost(post0)
  await post1.addUsers([user0, user2])
  return [user0, user1, user2, post0, post1, post2]
}
let [user0, user1, user2, post0, post1, post2] = await reset()
let rows;

// Sanity test.
rows = await post0.getUsers({order: [['name', 'ASC']]})
assert.strictEqual(rows[0].name, 'user0');
assert.strictEqual(rows.length, 1);
rows = await post1.getUsers({order: [['name', 'ASC']]})
assert.strictEqual(rows[0].name, 'user0');
assert.strictEqual(rows[1].name, 'user2');
assert.strictEqual(rows.length, 2);
rows = await post2.getUsers({order: [['name', 'ASC']]})
assert.strictEqual(rows.length, 0);

// Now stuff that we weren't able to do without super. Is it possible without??

// TODO Get all posts, and also determine if user2 likes each of of them or not.
// by doing LEFT OUTER JOIN.
rows = await Post.findAll({
  include: [{
    model: UserLikesPost,
    where: { UserId: user2.id },
    required: false,
    include: [{
      model: User
    }]
  }],
  order: [['body', 'ASC']],
})
assert.strictEqual(rows[0].body, 'post0');
assert.strictEqual(rows[0].UserLikesPosts.length, 0);
assert.strictEqual(rows[1].body, 'post1');
assert.strictEqual(rows[1].UserLikesPosts.length, 1);
assert.strictEqual(rows[2].body, 'post2');
assert.strictEqual(rows[2].UserLikesPosts.length, 0);
assert.strictEqual(rows.length, 3);

})().finally(() => { return sequelize.close() });
