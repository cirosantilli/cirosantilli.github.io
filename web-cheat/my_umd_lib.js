// https://cirosantilli.com/cirodown#universal-module-definition
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Meh.
    define(['exports'], factory);
  } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    // CommonJS
    factory(exports);
  } else {
    // Browser globals
    const exports = {}
    factory(exports);
    root.my_umd_lib = exports
  }
}(this, (exports) => {
  exports.myvar = 'abc';
}));
