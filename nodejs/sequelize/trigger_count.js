#!/usr/bin/env node
// https://cirosantilli.com/sequelize-example
const path = require('path')
const { DataTypes } = require('sequelize')
const common = require('./common')
const sequelize = common.sequelize(__filename, process.argv[2])
const force = process.argv.length <= 3 || process.argv[3] !== '0'
;(async () => {

// on: lowercase 'insert', 'delete' or 'update'
async function createTrigger(sequelize, model, on, action, { after, when, nameExtra } = {}) {
  if (after === undefined) {
    after = 'AFTER'
  }
  if (nameExtra) {
    nameExtra = `_${nameExtra})`
  } else {
    nameExtra = ''
  }
  const oldnew = on === 'delete' ? 'OLD' : 'NEW'
  const triggerName = `${model.tableName}_${on}${nameExtra}`
  if (when) {
    when = `\n  WHEN (${when})`
  } else {
    when = ''
  }
  if (sequelize.options.dialect === 'postgres') {
    const functionName = `${triggerName}_fn`
    await sequelize.query(`CREATE OR REPLACE FUNCTION "${functionName}"()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
  ${action};
  RETURN ${oldnew};
END;
$$
`)
    // CREATE OR REPLACE TRIGGER was only added on postgresql 14 so let's be a bit more portable for now:
    // https://stackoverflow.com/questions/35927365/create-or-replace-trigger-postgres
    await sequelize.query(`DROP TRIGGER IF EXISTS ${triggerName} ON "${model.tableName}"`)
    await sequelize.query(`CREATE TRIGGER ${triggerName}
  ${after} ${on.toUpperCase()}
  ON "${model.tableName}"
  FOR EACH ROW${when}
  EXECUTE PROCEDURE "${functionName}"();
`)
  } else if (sequelize.options.dialect === 'sqlite') {
    await sequelize.query(`
CREATE TRIGGER IF NOT EXISTS ${triggerName}
  ${after} ${on.toUpperCase()}
  ON "${model.tableName}"
  FOR EACH ROW${when}
  BEGIN
    ${action};
  END;
`)
  }
}

const Post = sequelize.define('Post', {
  title: { type: DataTypes.STRING },
});
const User = sequelize.define('User', {
  username: { type: DataTypes.STRING },
  postCount: { type: DataTypes.INTEGER },
});
User.hasMany(Post)
Post.belongsTo(User)
await sequelize.sync({ force })
await createTrigger(sequelize, Post, 'insert', `UPDATE "${User.tableName}" SET "postCount" = "postCount" + 1 WHERE id = NEW."UserId"`)
await createTrigger(sequelize, Post, 'delete', `UPDATE "${User.tableName}" SET "postCount" = "postCount" - 1 WHERE id = OLD."UserId"`)
await createTrigger(
  sequelize,
  Post,
  'update',
  `UPDATE "${User.tableName}" SET "postCount" = "postCount" - 1 WHERE id = OLD."UserId";
UPDATE "${User.tableName}" SET "postCount" = "postCount" + 1 WHERE id = NEW."UserId"`,
  {
    when: 'OLD."UserId" <> NEW."UserId"',
  }
)

async function reset() {
  const user0 = await User.create({ username: 'user0', postCount: 0 });
  const user1 = await User.create({ username: 'user1', postCount: 0 });
  await Post.create({ title: 'user0 post0', UserId: user0.id });
  await Post.create({ title: 'user0 post1', UserId: user0.id });
  await Post.create({ title: 'user1 post0', UserId: user1.id });
  return [user0, user1]
}
let rows, user0, user1
[user0, user1] = await reset()

// Check that the posts created increased postCount for users.
rows = await User.findAll({ order: [['username', 'ASC']] })
common.assertEqual(rows, [
  { username: 'user0', postCount: 2 },
  { username: 'user1', postCount: 1 },
])
rows = await Post.findAll({ order: [['title', 'ASC']] })
common.assertEqual(rows, [
  { title: 'user0 post0' },
  { title: 'user0 post1' },
  { title: 'user1 post0' },
])

// UPDATE the author of a post and check counts again.
await Post.update({ UserId: user1.id }, { where: { title: 'user0 post1' } })
rows = await User.findAll({ order: [['username', 'ASC']] })
common.assertEqual(rows, [
  { username: 'user0', postCount: 1 },
  { username: 'user1', postCount: 2 },
])
rows = await Post.findAll({ order: [['title', 'ASC']] })
common.assertEqual(rows, [
  { title: 'user0 post0' },
  { title: 'user0 post1' },
  { title: 'user1 post0' },
])

// DELETE some posts.

await Post.destroy({ where: { title: 'user0 post1' } })
rows = await User.findAll({ order: [['username', 'ASC']] })
common.assertEqual(rows, [
  { username: 'user0', postCount: 1 },
  { username: 'user1', postCount: 1 },
])
rows = await Post.findAll({ order: [['title', 'ASC']] })
common.assertEqual(rows, [
  { title: 'user0 post0' },
  { title: 'user1 post0' },
])

await Post.destroy({ where: { title: 'user0 post0' } })
rows = await User.findAll({ order: [['username', 'ASC']] })
common.assertEqual(rows, [
  { username: 'user0', postCount: 0 },
  { username: 'user1', postCount: 1 },
])
rows = await Post.findAll({ order: [['title', 'ASC']] })
common.assertEqual(rows, [
  { title: 'user1 post0' },
])

})().finally(() => { return sequelize.close() })
