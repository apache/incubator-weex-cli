var parser = require('./lib/parser')
var scripter = require('weex-scripter')
var transformerVersion = require('./package.json').version

function transform(name, code, path, elements, config) {
  var configType = Object.prototype.toString.call(config);
  config = configType === '[object Object]' ? config : {oldFormat: config}

  var path = path || '.'
  var elements = elements || {}
  var results = []
  var bootstrapParams = {}
  var thirdPartyJs = {}
  var logs = []
  var oldFormat = config.oldFormat === true ? true : false
  var isEntry = config.isEntry !== false ? true : false

  parser.parse(name, code, results, bootstrapParams, thirdPartyJs, logs, elements, path, oldFormat)

  var output = results.reverse().map(function (item) {
    return item.content
  }).join('\n\n// module\n\n')

  if (oldFormat) {
    output += '\n\n// require module\nrender(\'' + name + '\', {})'
  }
  else {
    if (Object.keys(thirdPartyJs).length) {
      output = [scripter.getBundle(thirdPartyJs), output].join('\n\n')
    }
    if (isEntry) {
      bootstrapParams.config = bootstrapParams.config || {}
      bootstrapParams.config.transformerVersion = transformerVersion
      var config = JSON.stringify(bootstrapParams.config)
      var data = JSON.stringify(bootstrapParams.data)
      output += '\n\n// require module\nbootstrap(\'@weex-component/' + name + '\', ' + config
      if (data) {
        output += ', ' + data + ')'
      }
      else {
        output += ')'
      }
    }
  }

  return {result: output, logs: logs}
}

function parseNew(name, content, results, bootstrapParams, thirdPartyJs, logs, elements, path) {
  return parser.parse(name, content, results, bootstrapParams, thirdPartyJs, logs, elements, path)
}

function parseOld(name, content, results, bootstrapParams, thirdPartyJs, logs, elements, path) {
  return parser.parse(name, content, results, bootstrapParams, thirdPartyJs, logs, elements, path, true)
}

function transformNew(name, code, path, elements, config) {
  return transform(name, code, path, elements, config)
}

function transformOld(name, code, path, elements) {
  return transform(name, code, path, elements, {oldFormat: true})
}

module.exports = {
  parse: parseNew,
  parseOld: parseOld,
  transform: transformNew,
  transformOld: transformOld
}
