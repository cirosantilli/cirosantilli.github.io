#!/usr/bin/env node

const Two = require('two.js')

function braket(two, text, x, y) {
  two.makeText('|' + text + '\u27E9', x, y);
}

require('./common').render(
  __filename,
  (two) => {
    let margin_left = two.width/10;
    let draw_width = two.width - 2*margin_left;
    let draw_height = two.height - 2*margin_left;
    let n = 9;
    let dw = draw_width/n;
    let line_width = dw*0.8;
    let dr = Math.PI/(n - 1);
    let line = new Two.Line(0, -line_width/2, 0, line_width/2);
    line.translation.set(margin_left - dw/2, two.height*2/5);
    line.rotation = -dr;
    let ellipse = new Two.Ellipse(0, 0, 0, line_width/2);
    ellipse.translation.set(margin_left - dw/2, two.height*3/5);
    let name_map = {
      2: ['+', 'i'],
      4: ['1', '1'],
      6: ['-', '-i'],
    };
    for (let i = 0; i < n; i++) {
      line = line.clone(two);
      line.translation.addSelf(new Two.Vector(dw, 0));
      line.rotation += dr;
      ellipse = ellipse.clone(two);
      ellipse.translation.addSelf(new Two.Vector(dw, 0));
      ellipse.height = line_width * Math.cos(line.rotation);
      ellipse.width = line_width * Math.sin(line.rotation);
      let name = name_map[i];
      if (name !== undefined) {
        braket(two, name[0], line.translation.x, two.height*1/5);
        braket(two, name[1], line.translation.x, two.height*4/5);
      }
    }

    let text_horizontal_off = 1.4;
    braket(two, '0', text_horizontal_off * margin_left/2, two.height/2);
    braket(two, '0', two.width - text_horizontal_off * margin_left/2, two.height/2);
  },
  400,
  200
);
