const fs = require('fs');
const path = require('path');

const Canvas = require('canvas');
const Two = require('two.js')

function render(filename, draw, width=200, height=100) {
  const canvas = Canvas.createCanvas(width, height, 'svg');
  Two.Utils.shim(canvas, Canvas.Image);
  const two = new Two({
    width: width,
    height: height,
    domElement: canvas
  });
  const background = two.makeRectangle(width/2, height/2, width, height);
  background.fill = 'white';
  draw(two);
  two.render();
  const filename_noext = path.parse(filename).name;
  fs.writeFileSync(path.resolve(filename_noext + '.svg'), canvas.toBuffer('image/svg'));
}
exports.render = render;
