#!/usr/bin/env node

// https://cirosantilli.com/node-js-sqlite3-package

var assert = require('assert');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
db.serialize(() => {
db.run(`CREATE TABLE IntegerNames (value INTEGER, name TEXT)`)
db.run(`INSERT INTO IntegerNames VALUES (2, "two")`)
db.run(`INSERT INTO IntegerNames VALUES (3, "three")`)
db.run(`INSERT INTO IntegerNames VALUES (5, "five")`)
db.all('SELECT * FROM IntegerNames ORDER BY value ASC', (err, rows) => {
  assert.strictEqual(rows[0].value, 2)
  assert.strictEqual(rows[0].name, 'two')
  assert.strictEqual(rows[1].value, 3)
  assert.strictEqual(rows[1].name, 'three')
  assert.strictEqual(rows[2].value, 5)
  assert.strictEqual(rows[2].name, 'five')
})
})
db.close();
