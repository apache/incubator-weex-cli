var merge = require('webpack-merge')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var configs = require('./webpack.base.config')
var webpack = require('webpack')
var config = require('../config')

var webConfig = configs[0]
var nativeConfig = configs[1]

webConfig = merge(webConfig, {
  // devtool: 'source-map',
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: config.build.publicRoot,
      verbose: false,
      watch: true
    }),
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ]
})

Object.keys(webConfig.entry).forEach(function (name) {
  webConfig.entry[name] = [config.dev.clientPath].concat(webConfig.entry[name])
})

module.exports = [webConfig, nativeConfig]
