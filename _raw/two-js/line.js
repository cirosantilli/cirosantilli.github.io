#!/usr/bin/env node

require('./common').render(
  __filename,
  (two) => {
    const line = two.makeLine(two.width/4, two.height/4, two.width/2, two.height/2);
    line.stroke = 'rgb(0, 0, 0)';
    line.linewidth = 5;
  }
);
