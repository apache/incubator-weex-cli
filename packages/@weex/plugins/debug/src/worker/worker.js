var __channelId__
var ___shouldReturnResult__ = false
var __requestId__

// The argument maybe an undefine value
var __protectedAragument__ = function(arg) {
  var args = Array.prototype.slice.call(arg)
  for (var i = 0; i < args.length; i++) {
    if (!args[i]) {
      args[i] = ''
    }
  }
  return args
}

var __postData__ = function(payload) {
  if (payload.method === 'WxDebug.callCreateBody' && !payload.params.domStr) {
    return
  }
  try {
    __postmessage__(payload)
  } catch (e) {
    self.console.warn(`CallNative with some non-json data:`, payload)
    payload = JSON.parse(JSON.stringify(payload))
    __postmessage__(payload)
  }
}

__eventEmitter__.on('WxDebug.callJS', function(data) {
  var method = data.params.method
  if (method === 'importScript') {
    importScripts(data.params.sourceUrl)
  } else if (method === 'destroyInstance') {
    // close worker
    self.destroyInstance(data.params.args[0])
    self.console.log('destroy')
  } else if (self[method]) {
    self[method].apply(null, data.params.args)
  } else {
    self.console.warn(
      'call [' + method + '] error: jsframework has no such api',
    )
  }
})

__eventEmitter__.on('WxDebug.changeLogLevel', function(message) {
  self.WXEnvironment.logLevel = message.params
})

__eventEmitter__.on('Console.messageAdded', function(message) {
  self.console.error('[Native Error]', message.params.message.text)
})

__eventEmitter__.on('WxDebug.importScript', function(message) {
  if (message.params.sourceUrl) {
    importScripts(message.params.sourceUrl)
  } else {
    new Function('', message.params.source)()
  }
})

__eventEmitter__.on('WxDebug.initWorker', function(message) {
  var createWeexBundleEntry = function(sourceUrl) {
    var code = ''
    if (self.$$frameworkFlag[sourceUrl] || self.$$frameworkFlag['@']) {
      code += `// { "framework": "${self.$$frameworkFlag[sourceUrl] ||
        self.$$frameworkFlag['@']}" }\n`
    }
    code += '__weex_bundle_entry__('
    injectedGlobals.forEach(function(g, i) {
      code += 'typeof ' + g + '==="undefined"?undefined:' + g
      if (i < injectedGlobals.length - 1) {
        code += ','
      }
    })
    // Avoiding the structure of comments in the last line causes `}` to be annotated
    code += '\n);'
    return code
  }
  var injectedGlobals = [
    'Promise',
    // W3C
    'window',
    'weex',
    'service',
    'Rax',
    'services',
    'global',
    'screen',
    'document',
    'navigator',
    'location',
    'fetch',
    'Headers',
    'Response',
    'Request',
    'URL',
    'URLSearchParams',
    'setTimeout',
    'clearTimeout',
    'setInterval',
    'clearInterval',
    'requestAnimationFrame',
    'cancelAnimationFrame',
    'alert',
    // ModuleJS
    'define',
    'require',
    // Weex
    'bootstrap',
    'register',
    'render',
    '__d',
    '__r',
    '__DEV__',
    '__weex_define__',
    '__weex_require__',
    '__weex_viewmodel__',
    '__weex_document__',
    '__weex_bootstrap__',
    '__weex_options__',
    '__weex_data__',
    '__weex_downgrade__',
    '__weex_require_module__',
    'Vue',
  ]
  var url = message.params.sourceUrl
  __channelId__ = message.channelId
  for (var key in message.params.env) {
    if (message.params.env.hasOwnProperty(key)) {
      self[key] = message.params.env[key]
    }
  }
  if (message.params.jsservice) {
    message.params.jsservice.forEach(function(script) {
      importScripts(script)
    })
  }
  __rewriteLog__(message.params.env.WXEnvironment.logLevel)
  self.createInstance(
    message.params.args[0],
    createWeexBundleEntry(url),
    message.params.args[2],
    message.params.args[3],
  )
})
