const path = require('path');

const distDir = path.resolve(__dirname, 'dist');

module.exports = {
  devServer: {
    contentBase: distDir,
    compress: true,
    port: 9000,
  },
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      // Load fonts for KaTeX fonts.
      // https://webpack.js.org/guides/asset-management/
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  output: {
    clean: true,
    filename: '[name].js',
    path: distDir,

    // This will allow us to use exports of index.js on the browser
    // through the my_library_name UMD variable.
    library: 'my_library_name',
    libraryTarget: 'umd',
  },

  // Development stuff.
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
};
