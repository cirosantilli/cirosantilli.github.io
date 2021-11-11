#!/usr/bin/env node

// https://cirosantilli.com/sql-parallel-update-example

const assert = require('assert')
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')
const { DataTypes, Op } = require('sequelize')
const common = require('../common')
const sequelizes = Array.from(Array(2).keys(),
  i => common.sequelize(__filename, process.argv[2], {logging: (s) => console.log(`${i}: ${s}`)}))
const sequelize = sequelizes[0]
const sequelize2 = sequelizes[1]

let n
if (process.argv.length > 3) {
  n = parseInt(process.argv[3], 10)
} else {
  n = 10
}
let iters
if (process.argv.length > 4) {
  iters = parseInt(process.argv[4], 10)
} else {
  iters = 10
}
let isolation
if (process.argv.length > 5) {
  isolation = process.argv[5]
} else {
  isolation = 'SERIALIZABLE'
}

async function transaction(sequelize, cb) {
  let done = false
  while (!done) {
    if (isolation !== 'NONE') {
      if (sequelize.options.dialect === 'sqlite') {
        await sequelize.query(`BEGIN TRANSACTION`)
      } else {
        await sequelize.query(`BEGIN TRANSACTION ISOLATION LEVEL ${isolation}`)
      }
    }
    try {
      await cb(sequelize)
      if (isolation !== 'NONE') {
        await sequelize.query(`COMMIT`)
      }
      done = true;
    } catch (e) {
      if (
        sequelize.options.dialect === 'postgres' &&
        // This can happen randomly, and we have to re-run the transaction:
        // - could not serialize access due to read/write dependencies among transactions
        // - could not serialize access due to concurrent update
        // https://www.postgresql.org/docs/13/errcodes-appendix.html
        e.original.code === '40001'
      ) {
        if (isolation !== 'NONE') {
          await sequelize.query(`ROLLBACK`)
        }
      } else {
        // Error that we don't know how to handle.
        throw e;
      }
    }
  }
}

;(async () => {
try {
await common.drop(sequelize, 'PostTag')
await common.drop(sequelize, 'Tag')
await common.drop(sequelize, 'Post')
await Promise.all([
  `CREATE TABLE "Post" (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)`,
  `CREATE TABLE "Tag" (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE)`,
].map(s => sequelize.query(s)))
await sequelize.query(`
CREATE TABLE "PostTag" (
  "postId" INTEGER NOT NULL,
  "tagId" INTEGER NOT NULL,
  PRIMARY KEY ("postId", "tagId"),
  FOREIGN KEY ("postId") REFERENCES "Post"(id) ON DELETE CASCADE,
  FOREIGN KEY ("tagId") REFERENCES "Tag"(id) ON DELETE CASCADE
)
`)

// Initialize database with post0 <-> tag0, so exactly one tag per post.
// Except for tag0, which has no posts to start with.
let arr = []
for (let i = 0; i < n; i++) {
  arr.push(sequelize.query(`INSERT INTO "Post" VALUES (${i}, 'post${i}')`))
  arr.push(sequelize.query(`INSERT INTO "Tag" VALUES (${i}, 'tag${i}')`))
}
await Promise.all(arr)
arr = []
for (let i = 1; i < n; i++) {
  arr.push(sequelize.query(`INSERT INTO "PostTag" VALUES (${i}, ${i})`))
}
await Promise.all(arr)

// This thread will create a bunch of new posts with tag0
let rows, meta, done = false
;(async () => {
  for (let i = 0; i < iters; i++) {
    const postId = i + n
    const newTagId = postId
    const tagName = `tag0`
    const postTitle = `post${postId}`
    await sequelize.query(`INSERT INTO "Post" VALUES (${postId}, '${postTitle}')`)
    await transaction(sequelize, async (sequelize) => {
      if (sequelize.options.dialect === 'sqlite') {
        await sequelize.query(`INSERT OR IGNORE INTO "Tag" VALUES (${newTagId}, '${tagName}')`)
      } else {
        await sequelize.query(`INSERT INTO "Tag" VALUES (${newTagId}, '${tagName}') ON CONFLICT DO NOTHING`)
      }
      // Now we need to get the tag id, because we don't know if a new one was inserted or not, and there's no
      // way to get it back with the INSERT yet:
      // https://stackoverflow.com/questions/13244393/sqlite-insert-or-ignore-and-return-original-rowid
      ;[rows, meta] = await sequelize.query(`SELECT id FROM "Tag" WHERE name = '${tagName}'`)
      await sequelize.query(`INSERT INTO "PostTag" VALUES (${postId}, ${rows[0].id})`)
    })

    // Now check that the tag wasn't deleted by the other thread.
    ;[rows, meta] = await sequelize.query(`
SELECT
  "Post".id AS id,
  "Post".title AS title
FROM "Post"
INNER JOIN "PostTag"
  ON "Post"."id" = "PostTag"."postId"
INNER JOIN "Tag"
  ON "PostTag"."tagId" = "Tag".id
  AND "Tag".name = '${tagName}'
ORDER BY "Post".id ASC
`)
    assert.strictEqual(rows[0].title, postTitle)

    // DELETE this new post just to keep it's count at 0. This would be done from the other thread in the real example,
    // but then it would be harder to synchronize things to get a large number of such conflict cases happening.
    // We could do it by DELETEing all posts with a given tag from that thread however.
    await sequelize.query(`DELETE FROM "Post" WHERE id = ${postId}`)
  }
  done = true
})()

// This thread will repeatedly delete all tags with 0 posts.
while (!done) {
  await transaction(sequelize2, async sequelize2 => {
    await sequelize2.query(`
DELETE FROM "Tag"
WHERE "Tag".id IN (
  SELECT
    "Tag".id
  FROM "Tag"
  LEFT OUTER JOIN "PostTag"
    ON "Tag".id = "PostTag"."tagId"
  LEFT OUTER JOIN "Post"
    ON "PostTag"."postId" = "Post".id
  GROUP BY "Tag".id
  HAVING COUNT("Post".id) = 0
)
`)
  })
}
} catch (e) {
  console.error(e)
}
await Promise.all(sequelizes.map(s => s.close()))
})();
