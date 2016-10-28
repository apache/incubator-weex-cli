require('webpack')
require('weex-loader')

var path = require('path')

module.exports = {
  entry: {
    main: path.join(__dirname, 'src', 'weex-bootstrap.we?entry=true')
  },
  output: {
    path: 'dist',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.we(\?[^?]+)?$/,
        loaders: ['weex-loader']
      }
    ]
  }
}
