var webpack = require('webpack')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var merge = require('webpack-merge')
var config = require('../config')
var configs = require('./webpack.base.config')

var webConfig = configs[0]
var nativeConig = configs[1]

var env = config.build.env

webConfig = merge(webConfig, {
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: config.build.publicRoot,
      verbose: false
    }),
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true,
      output: {
        comments: false,
        beautify: false
      },
    })
  ]
})

module.exports = [webConfig, nativeConig]
