const path = require('path');

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
  entry: {
    index: ['./index.js'],
    main: ['./main.scss'],
  },
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader' },
          // This might help find the KaTeX fonts, but it leads to another failure...
          // https://github.com/bholloway/resolve-url-loader/issues/107
          // https://stackoverflow.com/questions/54042335/webpack-and-fonts-with-relative-paths
          // https://stackoverflow.com/questions/68366936/how-to-bundle-katex-css-from-node-modules-to-a-single-output-css-from-a-sass-us
          //'resolve-url-loader',
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: [nodeModulesPath],
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
