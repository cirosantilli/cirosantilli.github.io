#!/usr/bin/env node

const Two = require('two.js')

require('./common').render(
  __filename,
  (two) => {
    let n = 9;
    let dw = two.width/n;
    let line_width = dw*0.8;
    let dr = Math.PI/(n - 1);
    let line = new Two.Line(0, -line_width/2, 0, line_width/2);
    line.translation.set(-dw/2, two.height/2);
    line.rotation = -dr;
    for (let i = 0; i < n; i++) {
      // By passing two here we register the shape to the renderer.
      // https://github.com/jonobr1/two.js/issues/491
      line = line.clone(two);
      line.translation.addSelf(new Two.Vector(dw, 0));
      line.rotation += dr;
    }
  },
  400,
  100
);
