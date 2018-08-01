importScripts('/lib/constructors/EventEmitter.js');
self.$$frameworkFlag = {};
var channelId;
var shouldReturnResult = false;
var requestId;
var originGlobal;
var payloads = [];
var instanceMap = {};
var injectedContextVariable = ['Promise',
  // W3C
  'window', 'weex', 'service', 'Rax', 'services', 'global', 'screen', 'document', 'navigator', 'location', 'fetch', 'Headers', 'Response', 'Request', 'URL', 'URLSearchParams', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'requestAnimationFrame', 'cancelAnimationFrame', 'alert',
  // ModuleJS
  'define', 'require',
  // Weex
  'bootstrap', 'register', 'render', '__d', '__r', '__DEV__', '__weex_define__', '__weex_require__', '__weex_viewmodel__', '__weex_document__', '__weex_bootstrap__', '__weex_options__', '__weex_data__', '__weex_downgrade__', '__weex_require_module__', 'Vue',
  // hook
  'setTimeout', 'callNativeModule', 'callNativeComponent', 'callNative', 'callAddElement',
  // layout
  'callNativeLog', 'callCreateBody', 'callUpdateFinish', 'callCreateFinish', 'callRefreshFinish', 'callUpdateAttrs', 'callUpdateStyle', 'callRemoveElement', 'callMoveElement', 'callAddEvent', 'callRemoveEvent'
]
var injectedGlobals = ['Promise',
  // W3C
  'window', 'weex', 'service', 'Rax', 'services', 'global', 'screen', 'document', 'navigator', 'location', 'fetch', 'Headers', 'Response', 'Request', 'URL', 'URLSearchParams', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'requestAnimationFrame', 'cancelAnimationFrame', 'alert',
  // ModuleJS
  'define', 'require',
  // Weex
  'bootstrap', 'register', 'render', '__d', '__r', '__DEV__', '__weex_define__', '__weex_require__', '__weex_viewmodel__', '__weex_document__', '__weex_bootstrap__', '__weex_options__', '__weex_data__', '__weex_downgrade__', '__weex_require_module__', 'Vue'
];
var cachedSetTimeout = this.setTimeout;
var isSandbox = false;

Object.defineProperty(this, 'setTimeout', {
  get: function () {
    return cachedSetTimeout;
  },
  set: function () {}
});

function createWeexBundleEntry(sourceUrl) {
  var code = '';
  if (self.$$frameworkFlag[sourceUrl] || self.$$frameworkFlag['@']) {
    code += `// { "framework": "${(self.$$frameworkFlag[sourceUrl] || self.$$frameworkFlag['@'])}" }\n`;
  }
  code += '__weex_bundle_entry__(';
  injectedGlobals.forEach(function (g, i) {
    code += 'typeof ' + g + '==="undefined"?undefined:' + g;
    if (i < injectedGlobals.length - 1) {
      code += ',';
    }
  });
  // Avoiding the structure of comments in the last line causes `}` to be annotated
  code += '\n);';
  return code;
}

function createApiBundleEntry(instance) {
  return `__weex_api_entry__(instanceMap[${instance}]);`
}
var origConsole = self.console;
var clearConsole = self.console.clear.bind(self.console);
self.__WEEX_DEVTOOL__ = true;
var eventEmitter = new EventEmitter();

/**
 * helper
 */
function transitionString2Boob(str) {
  if (typeof str === 'boolean') {
    return str;
  }
  else if (str === 'true') {
    return true;
  }
  else {
    return false;
  }
}

// The argument maybe an undefine value
function protectedAragument(arg) {
  var args = Array.prototype.slice.call(arg);
  for(var i = 0; i < args.length; i++) {
    if (!args[i]){
      args[i] = '';
    }
  }
  return args;
}

function postData(payload) {
  if (payload.method === 'WxDebug.callCreateBody' && !payload.params.domStr) {
    return;
  }
  try {
    // self.console.debug(`CallNative with some json data:`, payload);
    postMessage(payload);
  }
  catch (e) {
    self.console.warn(`CallNative with some non-json data:`, payload);
    payload = JSON.parse(JSON.stringify(payload));
    postMessage(payload);
  }
  payloads.push(payload)
}

var _rewriteLog = function () {
  var LEVELS = ['error', 'warn', 'info', 'log', 'debug'];
  var backupConsole = {
    error: origConsole.error,
    warn: origConsole.warn,
    info: origConsole.info,
    log: origConsole.log,
    debug: origConsole.debug
  };

  function resetConsole() {
    self.console.error = backupConsole.error;
    self.console.warn = backupConsole.warn;
    self.console.info = backupConsole.info;
    self.console.log = backupConsole.log;
    self.console.debug = backupConsole.debug;
    self.console.time = origConsole.time;
    self.console.timeEnd = origConsole.timeEnd;
  }

  function noop() {}
  return function (logLevel) {
    resetConsole();
    LEVELS.slice(LEVELS.indexOf(logLevel) + 1).forEach(function (level) {
      self.console[level] = noop;
    })
  }
}();

/**
  * Run js code in a specific context.
  * @param {string} code
  * @param {object} context
*/
function runInContext(instanceId, code, context) {
  var keys = []
  var args = []
  for (var key in context) {
    if (key === '__core-js_shared__') {
      key = '__core_js_shared__'
    }
    keys.push(key)
    args.push(context[key])
  }
  var bundle = `
      ${code}
  `
  return (new Function(...keys, bundle))(...args)
}

self.callNativeModule = function () {
  var message = {
    method: 'WxDebug.syncCall',
    params: {
      method: 'callNativeModule',
      args: protectedAragument(arguments)
    },
    channelId: channelId
  }
  var result = syncRequest(message);
  if (shouldReturnResult && requestId) {
    postData({
      id: requestId,
      result: null,
      error: {
        errorCode: 0
      }
    });
  }
  if (result && result.error) {
    self.console.error(result.error);
    // throw new Error(result.error);
  }
  else return result && result.ret;
}

self.callNativeComponent = function () {
  var args = Array.prototype.slice.call(arguments);
  for(var i = 0; i < args.length; i++) {
    if (!args[i]){
      args[i] = ''
    }
  }
  var message = {
    method: 'WxDebug.syncCall',
    params: {
      method: 'callNativeComponent',
      args: args
    },
    channelId: channelId
  }
  var result = syncRequest(message);
  if (result.error) {
    self.console.error(result.error);
    // throw new Error(result.error);
  }
  else return result.ret;
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
  postData(payload);
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
  postData(payload);
};

self.nativeLog = function (args){
  _rewriteLog(self.WXEnvironment.logLevel);
  self.console.log(args)
}

/**
 * init hook function for (layout/sandbox)
 */
function initLayoutAndSandboxEnv() {
  self.callCreateBody = function (instance, domStr) {
    if (!domStr) return;
    var payload = {
      method: 'WxDebug.callCreateBody',
      params: {
        instance: instance,
        domStr: domStr
      }
    };
    postData(payload);
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
    postData(payload);
  };
  
  self.callCreateFinish = function (instance) {
    var payload = {
      method: 'WxDebug.callCreateFinish',
      params: {
        instance: instance
      }
    };
    postData(payload);
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
    postData(payload);
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
    postData(payload);
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
    postData(payload);
  }
  
  self.callRemoveElement = function (instance, ref) {
    var payload = {
      method: 'WxDebug.callRemoveElement',
      params: {
        instance: instance,
        ref: ref
      }
    };
    postData(payload);
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
    postData(payload);;
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
    postData(payload);
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
    postData(payload);
  }
}

eventEmitter.on('WxDebug.callJS', function (data) {
  var method = data.params.method;
  if (method === 'createInstance') {
    var url = data.params.sourceUrl;
    isSandbox = false;
    postMessage({
      method: 'WxRuntime.clearLog',
    });
    importScripts(url);
    self.createInstance(data.params.args[0], createWeexBundleEntry(url), data.params.args[2], data.params.args[3]);
    instanceMap[data.params.args[0]] = {};
  }
  else if (method === 'createInstanceContext') {
    if (!data.params) return;
    var instanceid = data.params.args[0];
    var options = data.params.args[1];
    var instanceData = data.params.args[2];
    var dependenceUrl = data.params.dependenceUrl;
    var context = {};
    var instanceContext = {};
    isSandbox = true;
    if (dependenceUrl) {
      // importScripts('./rax-api.js');
      importScripts(dependenceUrl);
    }
    for (var prop in global) {
      if (global.hasOwnProperty(prop) && injectedContextVariable.indexOf(prop) > -1) {
        context[prop] = global[prop];
      }
    }
    instanceContext = self.createInstanceContext(instanceid, options, instanceData);

    for (var prop in instanceContext) {
      if (instanceContext.hasOwnProperty(prop) && prop !== 'callNative') {
        context[prop] = instanceContext[prop];
      }
    }

    instanceMap[instanceid] = context;
    if (dependenceUrl) {
      runInContext(instanceid, createApiBundleEntry(instanceid), context)
    }
  }
  else if (method === 'importScript') {
    if (isSandbox) {
      var url = data.params.sourceUrl;
      var instanceContext = instanceMap[data.params.args[0]]
      importScripts(url)
      if (instanceContext) {
        runInContext(data.params.args[0], createWeexBundleEntry(url), instanceContext)
      }
    }
  }
  else if (method === 'destroyInstance') {
    if (instanceMap[data.params.args[0]]) {
      self.destroyInstance(data.params.args[0]);
      delete instanceMap[data.params.args[0]];
    }
    else {
      self.console.warn('invalid destroyInstance[' + data.params.args[0] + '] because runtime has been refreshed(It does not impact your code. )');
    }
  }
  else if (method === '__WEEX_CALL_JAVASCRIPT__') {
    var instanceContext = instanceMap[data.params.args[0]];
    if (instanceContext && instanceContext['__WEEX_CALL_JAVASCRIPT__']) {
      instanceContext['__WEEX_CALL_JAVASCRIPT__'].apply(null, data.params.args)
    }
  }
  else if ((instanceMap[data.params.args[0]] && instanceMap[data.params.args[0]][method]) || self[method]) {
    shouldReturnResult = false;
    if (isSandbox) {
      var instanceContext = instanceMap[data.params.args[0]];
      instanceContext[method].apply(null, data.params.args);
    }
    else {
      self[method].apply(null, data.params.args);
    }
  }
  else {
    self.console.warn('callJS[' + data.params.method + '] error: jsframework has no such api');
  }
});

function syncRequest(data) {
  var request = new XMLHttpRequest();
  request.open('POST', '/syncApi', false); // `false` makes the request synchronous
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify(data));
  if (request.status === 200) {
    return JSON.parse(request.responseText);
  }
  else {
    return {
      error: request.responseText
    };
  }
}


onmessage = function (message) {
  eventEmitter.emit(message.data && message.data.method, message.data)
};

eventEmitter.on('WxDebug.initJSRuntime', function (message) {
  channelId = message.channelId;
  for (var key in message.params.env) {
    if (message.params.env.hasOwnProperty(key)) {
      self[key] = message.params.env[key];
    }
  }
  if (transitionString2Boob(message.params.isLayoutAndSandbox)) {
    initLayoutAndSandboxEnv();
  }
  // importScripts('./js-framework.js');
  importScripts(message.params.url);
  _rewriteLog(message.params.env.WXEnvironment.logLevel);
});

eventEmitter.on('WxDebug.changeLogLevel', function (message) {
  self.WXEnvironment.logLevel = message.params;
});

eventEmitter.on('Console.messageAdded', function (message) {
  self.console.error('[Native Error]', message.params.message.text);
});

eventEmitter.on('WxDebug.importScript', function (data) {
    if (isSandbox) return;
    if (data.params.sourceUrl) {
      importScripts(data.params.sourceUrl);
    }
    else {
      new Function('', data.params.source)();
    }
})
