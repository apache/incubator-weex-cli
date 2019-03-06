const queryParser = require('querystring')
const URL = require('url')
const path = require('path')
const fse = require('fs-extra')
const util = require('./util')

const bundleWrapper = (code, sourceUrl) => {
  const injectedGlobals = [
    // ES
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
    'Vue'
  ]
  const bundlewrapper =
    'function __weex_bundle_entry__(' + injectedGlobals.join(',') + '){'
  const rearRegexp = /\/\/#\s*sourceMappingURL(?!.*?\s+.)|$/
  const match = /^\/\/\s?{\s?"framework"\s?:\s?"(\w+)"\s?}/.exec(code)
  let anno = ''
  if (match) {
    anno = '$$frameworkFlag["' + (sourceUrl || '@') + '"]="' + match[1] + '"\n'
  }
  return anno + bundlewrapper + code.replace(rearRegexp, '}\n$&')
}

const transformUrlToLocalUrl = sourceURl => {
  const rHttpHeader = /^(https?|taobao|qap):\/\/(?!.*your_current_ip)/i
  let bundleUrl
  if (rHttpHeader.test(sourceURl)) {
    const query = queryParser.parse(URL.parse(sourceURl).query)
    if (query['_wx_tpl']) {
      bundleUrl = util.normalize(query['_wx_tpl']).replace(rHttpHeader, '')
    }
    else {
      bundleUrl = util.normalize(sourceURl).replace(rHttpHeader, '')
    }
  }
  else {
    bundleUrl = sourceURl.replace(
      /^(https?|taobao|qap):\/\/(.*your_current_ip):(\d+)\//i,
      'file://'
    )
  }
  if (bundleUrl.charAt(bundleUrl.length - 1) === '?') {
    bundleUrl = bundleUrl.substring(0, bundleUrl.length - 1)
  }
  if (bundleUrl.charAt(bundleUrl.length - 1) === '?') {
    bundleUrl = bundleUrl.substring(0, bundleUrl.length - 1)
  }
  return '/source/' + bundleUrl
}

const eventConstructor = `// event constructor
function __EventEmitter__() {
  this._handlers = {};
}
  
__EventEmitter__.prototype = {
  constructor: __EventEmitter__,
  off: function (method, handler) {
      if (handler) {
        for (var i = 0; i < this._handlers[method].length; i++) {
          if (this._handlers[method][i] === handler) {
            this._handlers[method].splice(i, 1);
            i--;
          }
        }
      }
      else {
        this._handlers[method] = [];
      }
  },
  once: function (method, handler) {
  var self = this;
  var fired = false;
  function g() {
    self.off(method, g);
    if (!fired) {
      fired = true;
       handler.apply(self, Array.prototype.slice.call(arguments));
    }
  }
  this.on(method, g);
  },
  on: function (method, handler) {
    if (this._handlers[method]) {
      this._handlers[method].push(handler);
    }
    else {
      this._handlers[method] = [handler];
    }
  },
  _emit: function (method, args, context) {
    var handlers = this._handlers[method];
    if (handlers && handlers.length > 0) {
      handlers.forEach(function (handler) {
        handler.apply(context, args)
      });
      return true;
    }
    else {
      return false;
    }
  },
  emit: function (method) {
    var context = {};
    var args = Array.prototype.slice.call(arguments, 1);
    if (!this._emit(method, args, context)) {
      this._emit('*', args, context)
    }
    this._emit('$finally', args, context);
    return context;
  }
};`

const mockContextApi = `// Redefine the JSFramework API
var __syncRequest__ = function(data, channelId) {
  var request = new XMLHttpRequest();
  request.open("POST", \`/syncCallNative/$\{channelId}\`, false); // "false" makes the request synchronous
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify(data));
  if (request.status === 200) {
    return JSON.parse(request.responseText);
  } else {
    return {
      error: request.responseText
    };
  }
};

self.callNativeModule = function () {
  var message = {
    method: 'WxDebug.syncCall',
    params: {
      method: 'callNativeModule',
      args: __protectedAragument__(arguments)
    }
  }
  var result = __syncRequest__(message, __channelId__);
  if (result && result.error) {
    self.console.error(result.error);
    // throw new Error(result.error);
  }
  else {
    return result && result.ret
  };
}

self.callNativeComponent = function () {
  var args = Array.prototype.slice.call(arguments);
  for (var i = 0; i < args.length; i++) {
    if (!args[i]) {
      args[i] = ''
    }
  }
  var message = {
    method: 'WxDebug.syncCall',
    params: {
      method: 'callNativeComponent',
      args: args
    }
  }
  var result = __syncRequest__(message, __channelId__);
  if (result.error) {
    self.console.error(result.error);
    // throw new Error(result.error);
  }
  else {
    return result.ret;
  };
};

self.callNative = function (instance, tasks, callback) {
  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    if (task.method == 'addElement') {
      for (var key in task.args[1].style) {
        if (Number.isNaN(task.args[1].style[key])) {
          self.console.error('invalid value [NaN] for style [' + key + ']', task);
        }
      }
    }
  }
  var payload = {
    method: 'WxDebug.callNative',
    params: {
      instance: instance,
      tasks: tasks,
      callback: callback
    }
  };
  __postData__(payload);
};

self.callAddElement = function (instance, ref, dom, index, callback) {
  var payload = {
    method: 'WxDebug.callAddElement',
    params: {
      instance: instance,
      ref: ref,
      dom: dom,
      index: index,
      callback: callback
    }
  };
  __postData__(payload);
};

self.__updateComponentData = function (instance, componentId, data) {
  var payload = {
    method: 'WxDebug.callUpdateComponentData',
    params: {
      instance: instance,
      componentId: componentId + '',
      data: data
    }
  };
  __postData__(payload);
};

self.nativeLog = function (args) {
  self.console.log(args)
};`

const generateSandboxWorkerEntry = env => {
  const mockBrowserApi = `// Redefine navigator 
Object.defineProperty(navigator, 'appCodeName', {
  get: function() {
    return '${env.device.name}';
  }
});

Object.defineProperty(navigator, 'appName', {
  get: function() {
    return '${env.environment.WXEnvironment.appName}';
  }
});

Object.defineProperty(navigator, 'appVersion', {
  get: function() {
    return '${env.environment.WXEnvironment.appVersion}';
  }
});
  
Object.defineProperty(navigator, 'product', {
  get: function() {
    return '${env.device.name}';
  }
});

Object.defineProperty(navigator, 'platform', {
  get: function() {
    return '${env.device.platform}';
  }
});

Object.defineProperty(navigator, 'userAgent', {
  get: function() {
    return '${env.device.platform === 'android' ? 'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36' : 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'}';
  }
});

// Redefine console
var __origConsole__ = this.console;
var __rewriteLog__ = function () {
  var LEVELS = ['error', 'warn', 'info', 'log', 'debug'];
  var backupConsole = {
    error: __origConsole__.error,
    warn: __origConsole__.warn,
    info: __origConsole__.info,
    log: __origConsole__.log,
    debug: __origConsole__.debug
  };
  function resetConsole() {
    self.console.error = backupConsole.error;
    self.console.warn = backupConsole.warn;
    self.console.info = backupConsole.info;
    self.console.log = backupConsole.log;
    self.console.debug = backupConsole.debug;
    self.console.time = __origConsole__.time;
    self.console.timeEnd = __origConsole__.timeEnd;
  }
  
  function noop() {}
  return function (logLevel) {
    resetConsole();
    LEVELS.slice(LEVELS.indexOf(logLevel) + 1).forEach(function (level) {
      self.console[level] = noop;
    })
  }
}();

// Redefine timer
var __cachedSetTimeout__ = this.setTimeout;
Object.defineProperty(this, 'setTimeout', {
  get: function () {
    return __cachedSetTimeout__;
  },
  set: function () {}
});
var __cachedSetInterval__ = this.setInterval;
Object.defineProperty(this, 'setInterval', {
  get: function () {
    return __cachedSetInterval__;
  },
  set: function () {}
});
var __cachedClearTimeout__ = this.clearTimeout;
Object.defineProperty(this, 'clearTimeout', {
  get: function () {
    return __cachedClearTimeout__;
  },
  set: function () {}
});
var __cachedClearInterval__ = this.clearInterval;
Object.defineProperty(this, 'clearInterval', {
  get: function () {
    return __cachedClearInterval__;
  },
  set: function () {}
});

// Redefine onmessage
var __eventEmitter__ = new __EventEmitter__();
var __postmessage__ = self.postMessage
self.addEventListener('message', function(message) {
  __eventEmitter__.emit(message.data && message.data.method, message.data);
}, false);

`
  const worker = fse.readFileSync(
    path.join(__dirname, '../worker/sandbox_worker.js')
  )
  const mockAndroidApi = env.isLayoutAndSandbox
    ? `self.callCreateBody = function (instance, domStr) {
  if (!domStr) return;
  var payload = {
    method: 'WxDebug.callCreateBody',
    params: {
      instance: instance,
      domStr: domStr
    }
  };
  __postData__(payload);
};

self.callUpdateFinish = function (instance, tasks, callback) {
  var payload = {
    method: 'WxDebug.callUpdateFinish',
    params: {
      instance: instance,
      tasks: tasks,
      callback: callback
    }
  };
  __postData__(payload);
};

self.callCreateFinish = function (instance) {
  var payload = {
    method: 'WxDebug.callCreateFinish',
    params: {
      instance: instance
    }
  };
  __postData__(payload);
}

self.callRefreshFinish = function (instance, tasks, callback) {
  var payload = {
    method: 'WxDebug.callRefreshFinish',
    params: {
      instance: instance,
      tasks: tasks,
      callback: callback
    }
  };
  __postData__(payload);
}

self.callUpdateAttrs = function (instance, ref, data) {
  var payload = {
    method: 'WxDebug.callUpdateAttrs',
    params: {
      instance: instance,
      ref: ref,
      data: data
    }
  };
  __postData__(payload);
}

self.callUpdateStyle = function (instance, ref, data) {
  var payload = {
    method: 'WxDebug.callUpdateStyle',
    params: {
      instance: instance,
      ref: ref,
      data: data
    }
  };
  __postData__(payload);
}

self.callRemoveElement = function (instance, ref) {
  var payload = {
    method: 'WxDebug.callRemoveElement',
    params: {
      instance: instance,
      ref: ref
    }
  };
  __postData__(payload);
}

self.callMoveElement = function (instance, ref, parentRef, index_str) {
  var payload = {
    method: 'WxDebug.callMoveElement',
    params: {
      instance: instance,
      ref: ref,
      parentRef: parentRef,
      index_str: index_str
    }
  };
  __postData__(payload);;
}

self.callAddEvent = function (instance, ref, event) {
  var payload = {
    method: 'WxDebug.callAddEvent',
    params: {
      instance: instance,
      ref: ref,
      event: event
    }
  };
  __postData__(payload);
}

self.callRemoveEvent = function (instance, ref, event) {
  var payload = {
    method: 'WxDebug.callRemoveEvent',
    params: {
      instance: instance,
      ref: ref,
      event: event
    }
  };
  __postData__(payload);
}
`
    : ''
  let environment = `${eventConstructor}

${mockBrowserApi}

${mockContextApi}

${mockAndroidApi}
`
  if (env.jsframework) {
    environment += `importScripts('${env.jsframework}');\n`
    // environment += `importScripts('/lib/runtime/js-framework.js');\n`
  }
  return `${environment}
${worker}
  `
}

const generateWorkerEntry = env => {
  const mockBrowserApi = `// Redefine navigator 
Object.defineProperty(navigator, 'appCodeName', {
  get: function() {
    return '${env.device.name}';
  }
});

Object.defineProperty(navigator, 'appName', {
  get: function() {
    return '${env.environment.WXEnvironment.appName}';
  }
});

Object.defineProperty(navigator, 'appVersion', {
  get: function() {
    return '${env.environment.WXEnvironment.appVersion}';
  }
});
  
Object.defineProperty(navigator, 'product', {
  get: function() {
    return '${env.device.name}';
  }
});

Object.defineProperty(navigator, 'platform', {
  get: function() {
    return '${env.device.platform}';
  }
});

Object.defineProperty(navigator, 'userAgent', {
  get: function() {
    return '${env.device.platform === 'android' ? 'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36' : 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'}';
  }
});

// Redefine console
var __origConsole__ = this.console;
var __rewriteLog__ = function () {
  var LEVELS = ['error', 'warn', 'info', 'log', 'debug'];
  var backupConsole = {
    error: __origConsole__.error,
    warn: __origConsole__.warn,
    info: __origConsole__.info,
    log: __origConsole__.log,
    debug: __origConsole__.debug
  };
  function resetConsole() {
    self.console.error = backupConsole.error;
    self.console.warn = backupConsole.warn;
    self.console.info = backupConsole.info;
    self.console.log = backupConsole.log;
    self.console.debug = backupConsole.debug;
    self.console.time = __origConsole__.time;
    self.console.timeEnd = __origConsole__.timeEnd;
  }
  
  function noop() {}
  return function (logLevel) {
    resetConsole();
    LEVELS.slice(LEVELS.indexOf(logLevel) + 1).forEach(function (level) {
      self.console[level] = noop;
    })
  }
}();

// Redefine timer
var __cachedSetTimeout__ = this.setTimeout;
Object.defineProperty(this, 'setTimeout', {
  get: function () {
    return __cachedSetTimeout__;
  },
  set: function () {}
});
var __cachedSetInterval__ = this.setInterval;
Object.defineProperty(this, 'setInterval', {
  get: function () {
    return __cachedSetInterval__;
  },
  set: function () {}
});
var __cachedClearTimeout__ = this.clearTimeout;
Object.defineProperty(this, 'clearTimeout', {
  get: function () {
    return __cachedClearTimeout__;
  },
  set: function () {}
});
var __cachedClearInterval__ = this.clearInterval;
Object.defineProperty(this, 'clearInterval', {
  get: function () {
    return __cachedClearInterval__;
  },
  set: function () {}
});

// Redefine onmessage
var __eventEmitter__ = new __EventEmitter__();
var __postmessage__ = self.postMessage
self.addEventListener('message', function(message) {
  __eventEmitter__.emit(message.data && message.data.method, message.data);
}, false);

`
  const worker = fse.readFileSync(path.join(__dirname, '../worker/worker.js'))
  const androidMockApi = env.isLayoutAndSandbox
    ? `self.callCreateBody = function (instance, domStr) {
  if (!domStr) return;
  var payload = {
    method: 'WxDebug.callCreateBody',
    params: {
      instance: instance,
      domStr: domStr
    }
  };
  __postData__(payload);
};

self.callUpdateFinish = function (instance, tasks, callback) {
  var payload = {
    method: 'WxDebug.callUpdateFinish',
    params: {
      instance: instance,
      tasks: tasks,
      callback: callback
    }
  };
  __postData__(payload);
};

self.callCreateFinish = function (instance) {
  var payload = {
    method: 'WxDebug.callCreateFinish',
    params: {
      instance: instance
    }
  };
  __postData__(payload);
}

self.callRefreshFinish = function (instance, tasks, callback) {
  var payload = {
    method: 'WxDebug.callRefreshFinish',
    params: {
      instance: instance,
      tasks: tasks,
      callback: callback
    }
  };
  __postData__(payload);
}

self.callUpdateAttrs = function (instance, ref, data) {
  var payload = {
    method: 'WxDebug.callUpdateAttrs',
    params: {
      instance: instance,
      ref: ref,
      data: data
    }
  };
  __postData__(payload);
}

self.callUpdateStyle = function (instance, ref, data) {
  var payload = {
    method: 'WxDebug.callUpdateStyle',
    params: {
      instance: instance,
      ref: ref,
      data: data
    }
  };
  __postData__(payload);
}

self.callRemoveElement = function (instance, ref) {
  var payload = {
    method: 'WxDebug.callRemoveElement',
    params: {
      instance: instance,
      ref: ref
    }
  };
  __postData__(payload);
}

self.callMoveElement = function (instance, ref, parentRef, index_str) {
  var payload = {
    method: 'WxDebug.callMoveElement',
    params: {
      instance: instance,
      ref: ref,
      parentRef: parentRef,
      index_str: index_str
    }
  };
  __postData__(payload);;
}

self.callAddEvent = function (instance, ref, event) {
  var payload = {
    method: 'WxDebug.callAddEvent',
    params: {
      instance: instance,
      ref: ref,
      event: event
    }
  };
  __postData__(payload);
}

self.callRemoveEvent = function (instance, ref, event) {
  var payload = {
    method: 'WxDebug.callRemoveEvent',
    params: {
      instance: instance,
      ref: ref,
      event: event
    }
  };
  __postData__(payload);
}`
    : ''
  let environment = `${eventConstructor}
  
${mockBrowserApi}

${mockContextApi}

${androidMockApi}

self.$$frameworkFlag = {};
`
  if (env.jsframework) {
    environment += `importScripts('${env.jsframework}');\n`
    // environment += `importScripts('/lib/runtime/js-framework.js');\n`
  }
  if (env.importScripts && env.importScripts.length > 0) {
    env.importScripts.forEach(script => {
      environment += `importScripts('${script}');\n`
    })
  }
  if (env.sourceUrl) {
    environment += `importScripts('${env.sourceUrl}');\n`
  }
  return `
${environment}
${worker}
  `
}

const pickDomain = str => {
  if (/file:\/\//.test(str)) {
    return str.replace('file://', '')
  }
  if (/http(s)?/.test(str)) {
    return URL.parse(str).hostname
  }
}

module.exports = {
  bundleWrapper,
  transformUrlToLocalUrl,
  generateSandboxWorkerEntry,
  generateWorkerEntry,
  pickDomain
}
