#!/usr/bin/env node
// Must be run with node --expose-gc bench_mem.js as of Node.js 16.
a = []
for (let i = 0; i < 1000000; i++) {
  a.push(1)
}
while (true) {
  global.gc()
  console.error(process.memoryUsage());
}
