#!/usr/bin/env node

// https://cirosantilli.com/sequelize-example

const assert = require('assert');
const path = require('path');
const { DataTypes } = require('sequelize');
const common = require('./common')
const sequelize = common.sequelize(__filename, process.argv[2], { define: { timestamps: false } })
;(async () => {

// Create the tables.
const User = sequelize.define('User', {
  name: { type: DataTypes.STRING },
}, {});
User.belongsToMany(User, {through: 'UserFollowUser', as: 'Follows'});
await sequelize.sync({force: true});

// Create some users.

const user0 = await User.create({name: 'user0'})
const user1 = await User.create({name: 'user1'})
const user2 = await User.create({name: 'user2'})
const user3 = await User.create({name: 'user3'})

// Make user0 follow user1 and user2
await user0.addFollows([user1, user2])
// Make user2 and user3 follow user0
await user2.addFollow(user0)
await user3.addFollow(user0)

// Check that the follows worked.
const user0Follows = await user0.getFollows({order: [['name', 'ASC']]})
assert.strictEqual(user0Follows[0].name, 'user1');
assert.strictEqual(user0Follows[1].name, 'user2');
assert.strictEqual(user0Follows.length, 2);

const user1Follows = await user1.getFollows({order: [['name', 'ASC']]})
assert.strictEqual(user1Follows.length, 0);

const user2Follows = await user2.getFollows({order: [['name', 'ASC']]})
assert.strictEqual(user2Follows[0].name, 'user0');
assert.strictEqual(user2Follows.length, 1);

const user3Follows = await user3.getFollows({order: [['name', 'ASC']]})
assert.strictEqual(user3Follows[0].name, 'user0');
assert.strictEqual(user3Follows.length, 1);

// Same but with ID instead of object.
// Also get rid of all useless fields from the trough table.
{
  const user0Follows = (await User.findOne({
    where: {id: user0.id},
    attributes: [],
    include: [{
      model: User,
      as: 'Follows',
      through: {attributes: []},
    }],
  })).Follows
  assert.strictEqual(user0Follows[0].name, 'user1');
  assert.strictEqual(user0Follows[1].name, 'user2');
  assert.strictEqual(user0Follows.length, 2);
}

//// Yet another method with the many-to-many reversed.
//// TODO close to working, but on is being ignored...
//{
//  const user0Follows = await User.findAll({
//    include: [{
//      model: User,
//      as: 'Follows',
//      on: {
//        '$User.UserFollowUser.FollowIdasdf$': { [Sequelize.Op.col]: 'User.user_id' },
//        '$User.UserFollowUser.UserId$': user0.id,
//      },
//      attributes: [],
//      through: {attributes: []},
//    }],
//    order: [['name', 'ASC']],
//  })
//  // TODO
//  //assert.strictEqual(user0Follows[0].name, 'user1');
//  //assert.strictEqual(user0Follows[1].name, 'user2');
//  //assert.strictEqual(user0Follows.length, 2);
//}

// Find users that follow user0
{
  const followsUser0 = await User.findAll({
    include: [{
      model: User,
      as: 'Follows',
      where: {id: user0.id},
      attributes: [],
      through: {attributes: []}
    }],
    order: [['name', 'ASC']],
  })
  assert.strictEqual(followsUser0[0].name, 'user2');
  assert.strictEqual(followsUser0[1].name, 'user3');
  assert.strictEqual(followsUser0.length, 2);
}

// has methods
assert(!await user0.hasFollow(user0))
assert(!await user0.hasFollow(user0.id))
assert( await user0.hasFollow(user1))
assert( await user0.hasFollow(user2))
assert(!await user0.hasFollow(user3))

// Count method
assert.strictEqual(await user0.countFollows(), 2)

})().finally(() => { return sequelize.close() });