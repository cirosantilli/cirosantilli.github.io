#!/usr/bin/env node
// https://cirosantilli.com/sequelize-example
const assert = require('assert')
const { DataTypes, Op } = require('sequelize')
const common = require('./common')
const sequelize = common.sequelize(__filename, process.argv[2])
;(async () => {
const UserLikesPost = sequelize.define('UserLikesPost', {
  userId: {
    type: DataTypes.INTEGER,
  },
  postId: {
    type: DataTypes.INTEGER,
  },
}, {})
await UserLikesPost.sync({force: true})
await UserLikesPost.create({userId: 1, postId: 1})
await UserLikesPost.create({userId: 1, postId: 2})
await UserLikesPost.create({userId: 1, postId: 3})
await UserLikesPost.create({userId: 2, postId: 1})
await UserLikesPost.create({userId: 2, postId: 2})
await UserLikesPost.create({userId: 3, postId: 1})
await UserLikesPost.create({userId: 4, postId: 1})
// Count likes on all posts but:
// - don't consider likes userId 4
// - only return posts that have at least 2 likes
// Order posts by those with most likes first.
const postLikeCounts = await UserLikesPost.findAll({
  attributes: [
    'postId',
    [sequelize.fn('COUNT', '*'), 'count'],
  ],
  group: ['postId'],
  where: { userId: { [Op.ne]: 4 }},
  order: [[sequelize.col('count'), 'DESC']],
  having: sequelize.where(sequelize.fn('COUNT', '*'), Op.gte, 2)
})
assert.strictEqual(postLikeCounts[0].postId, 1)
assert.strictEqual(parseInt(postLikeCounts[0].get('count'), 10), 3)
assert.strictEqual(postLikeCounts[1].postId, 2)
assert.strictEqual(parseInt(postLikeCounts[1].get('count'), 10), 2)
assert.strictEqual(postLikeCounts.length, 2)
})().finally(() => { return sequelize.close() });
