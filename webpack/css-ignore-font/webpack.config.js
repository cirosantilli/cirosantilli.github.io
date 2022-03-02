const path = require('path');

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
  entry: {
    main: ['./main.css'],
  },
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          //'resolve-url-loader',
        ],
      },
      { test: /\.(woff2)$/i, type: 'asset/resource', },
      { test: /\.woff$/, loader: 'ignore-loader' },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
    minimize: true,
  },
  output: {
    clean: true,
  },
};
