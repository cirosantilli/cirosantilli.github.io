const assert = require('assert')
const obj: { i: number, s?: string } = { i: 1 }
assert.strictEqual(obj.i, 1)
obj.s = 'abc'
assert.strictEqual(obj.s, 'abc')
// Fails as desired.
// obj.x = true

const map = new Map<number, string>();
map.set(1, 'one');
// Fails as desired.
//map.set(2, 2);
