require('webpack')
require('weex-loader')

module.exports = {
  entry: {
    main: './src/main.we?entry=true'
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
