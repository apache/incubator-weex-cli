var through = require('through2')
var path = require('path')
var weexTransformer = require('weex-transformer')
var gutil = require('gulp-util')
var printf = require('printf')
var chalk = require('chalk')

var pluginName = require('./package.json').name

module.exports = function weex(options) {
  options = options || {}
  options.oldFormat = options.oldFormat === true ? true : false
  options.isEntry = options.isEntry !== false ? true : false

  /**
   * @this {Transform}
   */
  var transform = function transform(file, encoding, callback) {

    /* istanbul ignore if */
    if (file.isNull()) {
      return callback(null, file)
    }

    /* istanbul ignore if */
    if (file.isStream()) {
      return callback(new gutil.PluginError(pluginName, 'Streaming not supported'))
    }

    if (file.isBuffer()) {
      var filename = path.basename(file.path).replace(/\..+/, '')
      var dir = path.relative(file.cwd, file.base)
      var content = file._contents.toString()
      var ret = weexTransformer.transform(filename, content, dir, null, options)

      file.path = file.path.replace(/\..+/, '.js')
      file.contents = new Buffer(ret.result)

      // print logs
      ret.logs && ret.logs.forEach(function (log) {
        var reason = log.reason.toLowerCase()
        var formattedLog = printf('%-10s %4d:%-4d  %s', log.name, log.line, log.column, log.reason)
        if (reason.indexOf('note') !== 0) {
          formattedLog = chalk[reason.indexOf('error') === 0 ? 'red' : 'yellow'](formattedLog)
        }
        gutil.log(formattedLog)
      })
    }

    return callback(null, file)
  }

  return through.obj(transform)
}
