#!/usr/bin/env node
while (true) {
  global.gc()
  console.error(process.memoryUsage())
}
