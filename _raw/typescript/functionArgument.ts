// https://cirosantilli.com/typescript

const assert = require('assert')

// You can create function with untyped arguments.
function myfunc(
  myInt
) {
  return `${myInt} abc`
}
assert.strictEqual(myfunc(1), '1 abc')
assert.strictEqual(myfunc('def'), 'def abc')

// But why would you?
function myfunc2(myInt: number) {
  return `${myInt} abc`
}
assert.strictEqual(myfunc2(1), '1 abc')
// Type error.
//assert.strictEqual(myfunc2('def'), 'def abc')
