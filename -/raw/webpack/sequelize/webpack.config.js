const { ProvidePlugin } = require("webpack")

module.exports = {
  entry: {
    index: ['./index.js'],
  },
  mode: 'none',
  output: {
    filename: '[name].js',
  },
  target: 'node',

  // Blows up differently.
  //externals: {
  //  sequelize: 'sequelize',
  //},

  // Did not help.
  //plugins: [
  //  new ProvidePlugin({
  //    sqlite3: 'sqlite3',
  //  })
  //]
}
