#!/usr/bin/env node
const n = process.argv.length > 2 ? Number(process.argv[2]) : 0
console.log(`stdout: ${n}`)
console.error(`stderr: ${n}`)
process.exit(n)
