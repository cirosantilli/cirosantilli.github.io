module.exports = {
  entry: {
    index: ['./index.js'],
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
    ],
  },
};
