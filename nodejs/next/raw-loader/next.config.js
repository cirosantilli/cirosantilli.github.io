//const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules = config.module.rules.concat([
      {
        test: /\.md$/,
        use: 'raw-loader',
      }
    ]);
    return config
  },
}
