// https://cirosantilli.com/ourbigbook#universal-module-definition
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Meh.
    define(['exports'], factory);
  } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    // CommonJS
    factory(exports);
  } else {
    // Browser globals
    root.umd_my_lib = {}
    factory(root.umd_my_lib);
  }
}(this, (exports) => {
  exports.my_umd_var = 'my_umd_var_val';
}));
