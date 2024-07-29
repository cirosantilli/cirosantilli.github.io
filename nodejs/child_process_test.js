#!/usr/bin/env node
const assert = require('assert')
const child_process = require('child_process')
let stdout
stdout = child_process.execFileSync('./stdout_stderr_exit_code.js', ['0'])
assert.strictEqual(stdout.toString(), 'stdout: 0\n')
try {
  stdout = child_process.execFileSync('./stdout_stderr_exit_code.js', ['1'])
} catch(e) {
  assert.strictEqual(e.status, 1)
  assert.strictEqual(e.stdout.toString(), 'stdout: 1\n')
  assert.strictEqual(e.stderr.toString(), 'stderr: 1\n')
}
