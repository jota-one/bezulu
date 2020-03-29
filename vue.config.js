const path = require('path')
const config = require('./config.json')

module.exports = {
  lintOnSave: true,
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-nested')(),
          require('postcss-custom-media')({
            importFrom: {
              customMedia: {
                '--sm': '(min-width: 544px)',
                '--md': '(min-width: 769px)',
                '--lg': '(min-width: 992px)',
                '--xl': '(min-width: 1200px)'
              }
            }
          })
        ]
      }
    }
  },
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: config.title,
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  devServer: {
    historyApiFallback: true,
    contentBase: [
      path.join(__dirname, 'public'),
      path.join(__dirname, 'www')
    ]
  },
}