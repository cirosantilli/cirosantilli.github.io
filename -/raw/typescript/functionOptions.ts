// https://stackoverflow.com/questions/42108807/using-named-parameters-javascript-based-on-typescript/71679344#71679344

const assert = require('assert')

// Anonymous inline type approach.
// Generally not what you want if any of the arguments are optional:
// https://stackoverflow.com/questions/42108807/using-named-parameters-javascript-based-on-typescript/71679344#71679344
function myfunc(
  {
    myInt,
    myString,
    // We can also set defaults here directly which is nice.
    myString2='def',
  }: {
    myInt: number;
    myString?: string;
    // When using this type of interface, we are still forced to explicitly
    // give the type here again even though // it could in principle be deduced
    // from the default.
    myString2?: string;
  }
) {
  return `${myInt} ${myString} ${myString2}`
}

assert.strictEqual(
  myfunc({
    myInt: 1,
    myString: 'abc',
    myString2: 'lol',
  }),
  '1 abc lol'
)

assert.strictEqual(
  myfunc({
    myInt: 1,
    myString: 'abc',
  }),
  '1 abc def'
)

assert.strictEqual(
  myfunc({
    myInt: 1,
  }),
  '1 undefined def'
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

// This is a reasonable pattern.
function myfunc2({
  myInt=1,
  myString='abc',
  myString2='def',
}={}) {
  return `${myInt} ${myString} ${myString2}`
}

assert.strictEqual(
  myfunc2(),
  '1 abc def'
)

assert.strictEqual(
  myfunc2({}),
  '1 abc def'
)

// If you are lazy to set the type of myString this works.
function myfunc22({
  myInt=1,
  myString=undefined,
  myString2='def',
}={}) {
  return `${myInt} ${myString} ${myString2}`
}

assert.strictEqual(
  myfunc22(),
  '1 undefined def'
)

assert.strictEqual(
  myfunc22({myString: 'abc'}),
  '1 abc def'
)

// This works if you want all arguments optional, one without value, but all with type.
function myfunc23({
  myInt=1,
  myString,
  myString2='def',
}: {
  myInt?: number;
  myString?: string;
  myString2?: string;
} ={}) {
  return `${myInt} ${myString} ${myString2}`
}

assert.strictEqual(
  myfunc23(),
  '1 undefined def'
)

assert.strictEqual(
  myfunc23({myString: 'abc'}),
  '1 abc def'
)

// Type error. Default types are honored, which is good.
//assert.strictEqual(
//  myfunc2({ myInt: 'lol'}),
//  'lol abc def'
//)

// I don't think this can ever be better than the above.
function myfunc3(options = {
  myInt: 1,
  myString: 'abc',
  myString2: 'def',
}) {
  return `${options.myInt} ${options.myString} ${options.myString2}`
}

assert.strictEqual(
  myfunc3(),
  '1 abc def'
)

// Type error, missing myInt etc.
//assert.strictEqual(
//  myfunc3({}),
//  'undefined undefined undefined'
//)
