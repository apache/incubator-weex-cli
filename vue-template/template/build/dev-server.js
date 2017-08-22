var express = require('express')
var webpackConfigs = require('./webpack.dev.config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var opn = require('opn')
var ip = require('ip').address()
var config = require('../config')
var port = config.dev.port

var webWebpackConfig = webpackConfigs[0]
var nativeWebpackConfig = webpackConfigs[1]

var app = express()
var compiler = webpack(webWebpackConfig)

webpack(merge(nativeWebpackConfig, {
	watch: true,
	watchOptions: {
		ignored: /node_modules/
	}
}), function (err, stats) {
	if (err) {
		console.error('[weex-toolkit] error:', err)
	}
	if (stats.hasErrors()) {
		var info = stats.toJson()
		console.error('[weex-toolkit] error:', stats.errors)
	}
})

var autoOpen = true

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  // publicPath is required, whereas all other options are optional
	noInfo: true,
  publicPath: webWebpackConfig.output.publicPath,
	stats: {
		colors: true
	}
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
	path: '/__weex_hmr'
})

app.use(devMiddleware)
app.use(hotMiddleware)

app.use(express.static('public'))

var uri = 'http://' + ip + ':' + port + '/'

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening to ' + uri + '\n')
  if (autoOpen) {
    opn(uri)
  }
})

var server = app.listen(port)
