#!/usr/bin/env node
// https://cirosantilli.com/cirodown#universal-module-definition
const umd_my_lib = require('./umd_my_lib')
console.log(umd_my_lib.myvar);
