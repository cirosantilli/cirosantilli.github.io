#!/usr/bin/env node

require('./common').render(
  __filename,
  (two) => {

    let line = two.makeLine(two.width/4, two.height/4, two.width/4, 3*two.height/4);

    // Every object rotates around its origin. If we set the position in the constructor,,
    // it rotates around a far away position. Instead, we have to translate.
    // https://github.com/jonobr1/two.js/issues/143
    // https://github.com/jonobr1/two.js/issues/185
    // https://github.com/jonobr1/two.js/issues/471
    let line2 = two.makeLine(0, 0, 0, two.height/2);
    line2.rotation = Math.PI/2;
    line2.translation.addSelf(new Two.Vector(3*two.width/4, two.height/2));
    line2.rotation = Math.PI/2;
  }
);
