//const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push(
      {
        test: /\.md$/,
        use: 'raw-loader',
      }
    )
    return config
  },
}
