// https://stackoverflow.com/questions/42108807/using-named-parameters-javascript-based-on-typescript/71679344#71679344

const assert = require('assert')

interface myfuncOpts {
  myInt: number,
  myString?: string,
}

function myfunc({
  myInt,
  myString,
}: myfuncOpts) {
  return `${myInt} ${myString}`
}

const opts: myfuncOpts = { myInt: 1 }
if (process.argv.length > 2) {
  opts.myString = 'abc'
}

assert.strictEqual(
  myfunc(opts),
  '1 abc'
)
