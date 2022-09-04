#!/usr/bin/env node

// https://cirosantilli.com/sql-trigger

const assert = require('assert');
const common = require('../common')
const sequelize = common.sequelize(__filename, process.argv[2])
common.assertEqual.typecast = { cnt: (s) => parseInt(s, 10) }
;(async () => {

await common.drop(sequelize, 'Post')
await common.drop(sequelize, 'User')
await sequelize.query(`
CREATE TABLE "User" (
  "id" INTEGER NOT NULL,
  "username" TEXT NOT NULL,
  "postCount" INTEGER NOT NULL,
  PRIMARY KEY ("id")
)
`)
await sequelize.query(`
CREATE TABLE "Post" (
  "id" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "author" INTEGER NOT NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("author") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
)
`)

if (sequelize.options.dialect === 'postgres') {
// INSERT trigger
await sequelize.query(`
CREATE OR REPLACE FUNCTION User_postCount_insert_fn()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
  UPDATE "User" SET "postCount" = "postCount" + 1 WHERE id = NEW."author";
  RETURN NEW;
END;
$$
`)
await sequelize.query(`
CREATE TRIGGER User_postCount_insert
  AFTER INSERT
  ON "Post"
  FOR EACH ROW
  EXECUTE PROCEDURE User_postCount_insert_fn();
`)

// DELETE trigger
await sequelize.query(`
CREATE OR REPLACE FUNCTION User_postCount_delete_fn()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
  UPDATE "User" SET "postCount" = "postCount" - 1 WHERE id = OLD."author";
  RETURN OLD;
END;
$$
`)
await sequelize.query(`
CREATE TRIGGER User_postCount_delete
  AFTER DELETE
  ON "Post"
  FOR EACH ROW
  EXECUTE PROCEDURE User_postCount_delete_fn();
`)

// UPDATE trigger
await sequelize.query(`
CREATE OR REPLACE FUNCTION User_postCount_update_fn()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
  UPDATE "User" SET "postCount" = "postCount" - 1 WHERE id = OLD."author";
  UPDATE "User" SET "postCount" = "postCount" + 1 WHERE id = NEW."author";
  RETURN NEW;
END;
$$
`)
await sequelize.query(`
CREATE TRIGGER User_postCount_update
  AFTER UPDATE OF "author"
  ON "Post"
  FOR EACH ROW
  WHEN (OLD."author" IS DISTINCT FROM NEW."author")
  EXECUTE PROCEDURE User_postCount_update_fn();
`)
} else if (sequelize.options.dialect === 'sqlite') {
  // TODO is there a single syntax that works for both sqlite and postgresql?
  // Is there an ISO standard for it and does any of the two conform?
  // Related compatibility section: https://www.postgresql.org/docs/current/sql-createtrigger.html
await sequelize.query(`
CREATE TRIGGER User_postCount_insert
  AFTER INSERT
  ON "Post"
  FOR EACH ROW
  BEGIN
    UPDATE "User" SET "postCount" = "postCount" + 1 WHERE id = NEW."author";
  END;
`)
await sequelize.query(`
CREATE TRIGGER User_postCount_delete
  AFTER DELETE
  ON "Post"
  FOR EACH ROW
  BEGIN
    UPDATE "User" SET "postCount" = "postCount" - 1 WHERE id = OLD."author";
  END;
`)
await sequelize.query(`
CREATE TRIGGER User_postCount_update
  AFTER UPDATE
  ON "Post"
  FOR EACH ROW
  BEGIN
    UPDATE "User" SET "postCount" = "postCount" - 1 WHERE id = OLD."author";
    UPDATE "User" SET "postCount" = "postCount" + 1 WHERE id = NEW."author";
  END;
`)
}

async function reset() {
  await sequelize.query(`DELETE FROM "Post"`)
  await sequelize.query(`DELETE FROM "User"`)
  await sequelize.query(`
INSERT INTO "User" VALUES
(0, 'user0', 0),
(1, 'user1', 0)
`)
  await sequelize.query(`
INSERT INTO "Post" VALUES
(0, 'user0 post0', 0),
(1, 'user0 post1', 0),
(2, 'user2 post0', 1)
`)
}
await reset()

// Check that the posts created increased postCount for users.
;[rows, meta] = await sequelize.query(`SELECT * FROM "User" ORDER BY "User".id ASC`)
common.assertEqual(rows, [
  { id: 0, postCount: 2 },
  { id: 1, postCount: 1 },
])

// Change the author of a post and check counts again.
await sequelize.query(`UPDATE "Post" SET "author" = 1 WHERE "id" = 1`)
;[rows, meta] = await sequelize.query(`SELECT * FROM "User" ORDER BY "User"."id" ASC`)
common.assertEqual(rows, [
  { id: 0, postCount: 1 },
  { id: 1, postCount: 2 },
])

// Delete some posts.
await sequelize.query(`DELETE FROM "Post" WHERE id = 1`)
;[rows, meta] = await sequelize.query(`SELECT * FROM "User" ORDER BY "User".id ASC`)
common.assertEqual(rows, [
  { id: 0, postCount: 1 },
  { id: 1, postCount: 1 },
])

await sequelize.query(`DELETE FROM "Post" WHERE id = 0`)
;[rows, meta] = await sequelize.query(`SELECT * FROM "User" ORDER BY "User".id ASC`)
common.assertEqual(rows, [
  { id: 0, postCount: 0 },
  { id: 1, postCount: 1 },
])

})().finally(() => { return sequelize.close() });
