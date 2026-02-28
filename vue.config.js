module.exports = {
  lintOnSave: false,
  publicPath: '/arpg-sample/',
  outputDir: 'dist',
  devServer: {
    host: "127.0.0.1",
    port: 8081,
    disableHostCheck: true
  },
  configureWebpack: {
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        }
      ]
    }
  },
  transpileDependencies: [
    'pixi.js'
  ]
}
