let i: number|string
if (process.argv.length === 2) {
  i = 1
} else {
  i = 'asdf'
}
let closure: number|undefined
function f(j: number) {
  if (typeof closure === 'number') {
    return j + 1 + closure
  }
}
if (typeof i === 'number') {
  f(i)
}
