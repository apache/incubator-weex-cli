var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var vueLoaderConfig = require('./vue-loader.config.js')
var config = require('../config')

var baseConfig = {
  output: {
    path: config.build.publicDistRoot,
    // path: resolve('public/dist'),
    publicPath: config.build.publicPath,
    // publicPath: '/dist/'
  },
  module: {
    rules: [{
      test: /\.vue$/
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }]
  },
  plugins: [
    
  ]
}

var webConfig = merge(baseConfig, {
  entry: {
    app: config.build.entryPath.web,
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',
      options: vueLoaderConfig
    }],
  },
  output: {
    filename: '[name].web.js'
  }
})

var nativeConfig = merge(baseConfig, {
  entry: {
    app: config.build.entryPath.native,
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'weex-loader'
    }],
  },
  output: {
    filename: '[name].native.js'
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: '// { "framework": "Vue" } \n',
      raw: true,
      exclude: 'Vue'
    })
  ]
})

module.exports = [webConfig, nativeConfig]
