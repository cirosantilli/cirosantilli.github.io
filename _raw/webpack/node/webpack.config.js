const path = require('path');

const nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
  entry: {
    index: ['./index.js'],
  },
  mode: 'none',
  output: {
    filename: '[name].js',
  },
  target: 'node',
}
