#!/usr/bin/env node
// https://cirosantilli.com/ourbigbook#universal-module-definition
const umd_my_lib = require('./umd_my_lib')
console.log(umd_my_lib.my_umd_var);
