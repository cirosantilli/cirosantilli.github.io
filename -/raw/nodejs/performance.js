#!/usr/bin/env node

const { performance } = require('perf_hooks')
const now = performance.now.bind(performance)

//const now = perf_hooks.performance.now

const t0 = now()
for (i = 0; i < 1000000; i++)
  ;
console.log((now() - t0)/1000.0)
