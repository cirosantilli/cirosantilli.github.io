#!/usr/bin/env node
let i = 0
let max
if (process.argv.length > 2) {
  max = parseInt(process.argv[2])
} else {
  max = 1
}
while (i < max) {
  i++
}
