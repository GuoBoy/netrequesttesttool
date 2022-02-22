// eslint-disable-next-line @typescript-eslint/no-var-requires
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin(['plaintext', 'javascript', 'html', 'json'])
    ]
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        productName: 'NRTT',
        appId: 'com.gzh.nrtt',
        copyright: 'gzh',
        win: {
          icon: './src/assets/icon.ico'
        }
      }
    }
  }
}
