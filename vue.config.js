module.exports = {
  assetsDir: 'static',
  parallel: false,
  publicPath: './',
  configureWebpack: {
    resolve: {
      alias: {
        'components': '@/components',
        'content': 'components/content',
        'common': 'components/common',
        'assets': '@/assets',
        'network': '@/network',
        'views': '@/views',
        'commons': '@/common'
      }
    }
  }
}