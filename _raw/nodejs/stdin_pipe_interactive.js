#!/usr/bin/env node

// https://stackoverflow.com/questions/30441025/read-all-text-from-stdin-to-a-string/54565854#54565854
// Works on both pipe and interactive input. Ctrl + C works and exits program.
// TODO requires Ctrl + D to be pressed twice if interactive input does not end in newline.

const fs = require('fs')

async function read(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString('utf8');
}

(async () => {
const ret = await read(process.stdin)
console.log(`Read: ${typeof(ret)}\n${ret}`)
})()
