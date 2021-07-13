const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const distDir = path.resolve(__dirname, 'dist');

module.exports = {
  devServer: {
    contentBase: distDir,
    compress: true,
    port: 9000,
  },
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      // Inject the include to our hashed filename,
      // since it is not deterministic due to the hash.
      inject: true,
      template: path.resolve(__dirname, 'src', 'index.html'),
    }),
  ],
  output: {
    clean: true,
    // Add a hash to the file so that browsers can cache agressively.
    filename: '[name].[contenthash].js',
    path: distDir,
  },
};
