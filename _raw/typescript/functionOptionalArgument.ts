// https://cirosantilli.com/typescript

const assert = require('assert')

function myfunc(
  myInt: number,
  // We can us the `?` here directly to indicate that it is optional.
  myString?: string,
) {
  return `${myInt} ${myString}`
}
assert.strictEqual(myfunc(1, 'abc'), '1 abc')
assert.strictEqual(myfunc(1), '1 undefined')
// Type error.
//assert.strictEqual(myfunc(1, 1), '1 1')

function myfunc2(
  myInt: number,
  // This achieves a similar effect. But then I don't know how to set the type of myString.
  // so it is less good.
  myString=undefined,
) {
  return `${myInt} ${myString}`
}

assert.strictEqual(myfunc2(1, 'abc'), '1 abc')
assert.strictEqual(myfunc2(1), '1 undefined')
// Type not enforced. Bad.
assert.strictEqual(myfunc2(1, 1), '1 1')
