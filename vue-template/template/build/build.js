process.env.NODE_ENV = 'production'

var path = require('path')
var ora = require('ora')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var configs = require('./webpack.prod.config')

var webConfig = configs[0]
var nativeConfig = configs[1]

var spinner = ora('building for production...')
spinner.start()

webpack(configs, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')

  console.log(chalk.cyan('  Build complete.\n'))
  console.log(chalk.yellow(
    '  Tip: built files are meant to be served over an HTTP server.\n' +
    '  Opening dist/index.html over file:// won\'t work.\n'
  ))
})
