exports.cjs_constant = 'My_cjs_constant'

const cjs_func_global = 'My_cjs_func_global'
const { cjs_constant2 } = require('./cjs2.js')
function cjs_func() {
  return cjs_func_global + cjs_constant2 + 'lala'
}

exports.cjs_func = cjs_func
