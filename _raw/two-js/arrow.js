#!/usr/bin/env node

// https://github.com/jonobr1/two.js/pull/368

require('./common').render(
  __filename,
  (two) => {
    const line = two.makeArrow(two.width/4, two.height/4, two.width/2, two.height/2, 14);
    line.stroke = 'rgb(0, 0, 0)';
    line.linewidth = 2;
  }
);
