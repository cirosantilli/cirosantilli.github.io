const path = require('path');

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
  entry: {
    index: ['./index.js'],
    main: ['./main.less'],
  },
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                // Not needed for less unliked for sass.
                paths: [nodeModulesPath],
              },
            },
          },
        ],
      },
      // Fonts.
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
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
    filename: '[name].js',
  },
};
