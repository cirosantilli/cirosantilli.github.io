#!/usr/bin/env node
const childProcess = require('child_process')
const readline = require('readline')
const p = childProcess.spawn('./count.js', ['2'])
;(async function() {
const rl = readline.createInterface({ input: p.stdout })
for await (const line of rl) {
  console.log(line)
}
})()
