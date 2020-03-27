const path = require('path')

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
  devServer: {
    contentBase: [
      path.join(__dirname, 'public'),
      path.join(__dirname, 'www')
    ]
  }
}