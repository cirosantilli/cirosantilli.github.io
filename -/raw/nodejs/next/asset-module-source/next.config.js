module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push(
      {
        test: /\.md$/,
        type: 'asset/source',
      }
    )
    return config
  },
}
