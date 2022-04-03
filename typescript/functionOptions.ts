// https://stackoverflow.com/questions/42108807/using-named-parameters-javascript-based-on-typescript/71679344#71679344

const assert = require('assert')

function myfunc(
  {
    myInt,
    myString,
  }: {
    myInt: number,
    myString?: string,
  }
) {
  return `${myInt} ${myString}`
}

assert.strictEqual(
  myfunc({
    myInt: 1,
    myString: 'abc',
  }),
  '1 abc'
)

assert.strictEqual(
  myfunc({
    myInt: 1,
  }),
  '1 undefined'
)

// Fails as desired since myInt is not optional and was not given.
//assert.strictEqual(
//  myfunc({
//    myString: 'abc',
//  }),
//  'unefined abc'
//)

// Fails as desired since wrong type of myInt.
//assert.strictEqual(
//  myfunc({
//    myInt: '1',
//    myString: 'abc',
//  }),
//  '1 abc'
//)
