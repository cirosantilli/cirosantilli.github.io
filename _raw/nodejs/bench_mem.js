#!/usr/bin/env node

// https://cirosantilli.com/node-js

// CLI arguments.
let arr = false
let array_buffer = false
let dealloc = false
let klass = false
let obj = false
let n = 1000000
let objn = 0
for (let i = 2; i < process.argv.length; i++) {
  switch (process.argv[i]) {
    case 'arr':
      arr = true
    break
    case 'array-buffer':
      array_buffer = true
    break
    case 'class':
      klass = true
    break
    case 'dealloc':
      dealloc = true
    break
    case 'obj':
      obj = true
    break
    case 'n':
      i++
      n = parseInt(process.argv[i], 10)
    break
    case 'objn':
      i++
      objn = parseInt(process.argv[i], 10)
    break
    default:
      console.error(`unknown option: ${process.argv[i]}`);
    break
  }
}

class MyClass {
  constructor(a, b) {
    this.a = a
    this.b = b
  }
}

let a
if (array_buffer) {
  a = new Int32Array(new ArrayBuffer(n * 4))
  for (let i = 0; i < n; i++) {
    a[i] = i
  }
} else if (obj) {
  a = []
  for (let i = 0; i < n; i++) {
    a.push({ a: i, b: -i })
  }
} else if (objn) {
  a = []
  for (let i = 0; i < n; i++) {
    const obj = {}
    for (let j = 0; j < objn; j++) {
      obj[String.fromCharCode(65 + j)] = i
    }
    a.push(obj)
  }
} else if (klass) {
  a = []
  for (let i = 0; i < n; i++) {
    a.push({ a: i, b: -i })
  }
} else if (klass) {
  a = []
  for (let i = 0; i < n; i++) {
    a.push(new MyClass(i, -i))
  }
} else if (arr) {
  a = []
  for (let i = 0; i < n; i++) {
    a.push([i, -i])
  }
} else {
  a = []
  for (let i = 0; i < n; i++) {
    a.push(i)
  }
}

if (dealloc) {
  a = undefined
}

let j
while (true) {
  if (!dealloc) {
    j = 0
    // The collector somehow removes a if we don't reference it here.
    for (let i = 0; i < n; i++) {
      if (obj || klass) {
        j += a[i].a + a[i].b
      } else if (objn) {
        const obj = a[i]
        for (let k = 0; k < objn; k++) {
          j += obj[String.fromCharCode(65 + k)]
        }
      } else if (arr) {
        j += a[i][0] + a[i][1]
      } else {
        j += a[i]
      }
    }
    console.error(j)
  }
  global.gc()
  console.error(process.memoryUsage())
}
