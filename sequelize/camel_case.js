#!/usr/bin/env node

// https://cirosantilli.com/sequelize-example

const assert = require('assert');
const path = require('path');

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'tmp.' + path.basename(__filename) + '.sqlite',
  define: {
    timestamps: false
  },
});

(async () => {

// Create the tables.
const User = sequelize.define('User', {
  name: { type: DataTypes.STRING },
});
const Post = sequelize.define('Post', {
  body: { type: DataTypes.STRING },
});
const UserFollowsUser = sequelize.define('UserFollowsUser', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  followId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
});
User.belongsToMany(User, {
  through: UserFollowsUser,
  as: 'follows',
  foreignKey: 'userId',
  otherKey: 'followId',
});
User.hasMany(Post, {foreignKey: 'authorId'});
Post.belongsTo(User, {foreignKey: 'authorId'});
await sequelize.sync({force: true});

// Create data.
const users = await User.bulkCreate([
  {name: 'user0'},
  {name: 'user1'},
  {name: 'user2'},
  {name: 'user3'},
])

const posts = await Post.bulkCreate([
  {body: 'body00', authorId: users[0].id},
  {body: 'body01', authorId: users[0].id},
  {body: 'body10', authorId: users[1].id},
  {body: 'body11', authorId: users[1].id},
  {body: 'body20', authorId: users[2].id},
  {body: 'body21', authorId: users[2].id},
  {body: 'body30', authorId: users[3].id},
  {body: 'body31', authorId: users[3].id},
])
await users[0].addFollows([users[1], users[2]])

// Check case of auto-getters.

const user0Posts = await users[0].getPosts({order: [['body', 'ASC']]})
assert.strictEqual(user0Posts[0].body, 'body00')
assert.strictEqual(user0Posts[1].body, 'body01')
assert.strictEqual(user0Posts.length, 2)

const user1Posts = await users[1].getPosts({order: [['body', 'ASC']]})
assert.strictEqual(user1Posts[0].body, 'body10')
assert.strictEqual(user1Posts[1].body, 'body11')
assert.strictEqual(user1Posts.length, 2)

const post00User = await posts[0].getUser()
assert.strictEqual(post00User.name, 'user0')

const post01User = await posts[1].getUser()
assert.strictEqual(post01User.name, 'user0')

const post10User = await posts[2].getUser()
assert.strictEqual(post10User.name, 'user1')

const post11User = await posts[3].getUser()
assert.strictEqual(post11User.name, 'user1')

// Check case of as;
{
  const user0Follows = (await User.findByPk(users[0].id, {
    include: [
      {
        model: User,
        as: 'follows',
        include: [
          {
            model: Post,
          }
        ],
      },
    ],
  })).follows
  const postsFound = []
  for (const followedUser of user0Follows) {
    postsFound.push(...followedUser.Posts)
  }
  postsFound.sort((x, y) => { return x.body < y.body ? -1 : x.body > y.body ? 1 : 0 })
  assert.strictEqual(postsFound[0].body, 'body10')
  assert.strictEqual(postsFound[1].body, 'body11')
  assert.strictEqual(postsFound[2].body, 'body20')
  assert.strictEqual(postsFound[3].body, 'body21')
  assert.strictEqual(postsFound.length, 4)
}

await sequelize.close();
})();
