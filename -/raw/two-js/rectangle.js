#!/usr/bin/env node

// https://github.com/jonobr1/two.js/tree/52ed7a7e6573f212b65247361b7417cda362e939

require('./common').render(
  __filename,
  (two) => {
    const rect = two.makeRectangle(two.width/2, two.height/2, two.width/8, two.height/4);
    rect.fill = 'rgb(255, 100, 100)';
    rect.noStroke();
  }
);
