#!/usr/bin/env node
(async function() {
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
let i = 0
let max
if (process.argv.length > 2) {
  max = parseInt(process.argv[2])
}
while (true) {
  console.log(i)
  if (i === max) break
  await sleep(1000)
  i++
}
})()
