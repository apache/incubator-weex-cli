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
};

// mock environment
var __channelId__;
var ___shouldReturnResult__ = false;
var __requestId__;
var __eventEmitter__ = new __EventEmitter__();

// The argument maybe an undefine value
var __protectedAragument__ = function(arg) {
  var args = Array.prototype.slice.call(arg);
  for (var i = 0; i < args.length; i++) {
    if (!args[i]) {
      args[i] = "";
    }
  }
  return args;
};

var __postData__ = function(payload) {
  if (payload.method === "WxDebug.callCreateBody" && !payload.params.domStr) {
    return;
  }
  try {
    // self.console.debug(`CallNative with some json data:`, payload);
    postMessage(payload);
  } catch (e) {
    self.console.warn(`CallNative with some non-json data:`, payload);
    payload = JSON.parse(JSON.stringify(payload));
    postMessage(payload);
  }
};

var __syncRequest__ = function(data) {
  var request = new XMLHttpRequest();
  request.open("POST", "/syncApi", false); // `false` makes the request synchronous
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

self.__WEEX_DEVTOOL__ = true;

self.callNativeModule = function() {
  var message = {
    method: "WxDebug.syncCall",
    params: {
      method: "callNativeModule",
      args: __protectedAragument__(arguments)
    },
    channelId: __channelId__
  };
  var result = __syncRequest__(message);
  if (___shouldReturnResult__ && __requestId__) {
    __postData__({
      id: __requestId__,
      result: null,
      error: {
        errorCode: 0
      }
    });
  }
  if (result && result.error) {
    self.console.error(result.error);
    // throw new Error(result.error);
  } else return result && result.ret;
};

self.callNativeComponent = function() {
  var args = Array.prototype.slice.call(arguments);
  for (var i = 0; i < args.length; i++) {
    if (!args[i]) {
      args[i] = "";
    }
  }
  var message = {
    method: "WxDebug.syncCall",
    params: {
      method: "callNativeComponent",
      args: args
    },
    channelId: __channelId__
  };
  var result = __syncRequest__(message);
  if (result.error) {
    self.console.error(result.error);
    // throw new Error(result.error);
  } else return result.ret;
};

self.callNative = function(instance, tasks, callback) {
  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    if (task.method == "addElement") {
      for (var key in task.args[1].style) {
        if (Number.isNaN(task.args[1].style[key])) {
          self.console.error(
            "invalid value [NaN] for style [" + key + "]",
            task
          );
        }
      }
    }
  }
  var payload = {
    method: "WxDebug.callNative",
    params: {
      instance: instance,
      tasks: tasks,
      callback: callback
    }
  };
  __postData__(payload);
};

self.callAddElement = function(instance, ref, dom, index, callback) {
  var payload = {
    method: "WxDebug.callAddElement",
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

self.nativeLog = function(args) {
  __rewriteLog__(self.WXEnvironment.logLevel);
  self.console.log(args);
};

self.onmessage = function(message) {
  __eventEmitter__.emit(message.data && message.data.method, message.data);
};

__eventEmitter__.on("WxDebug.callJS", function(data) {
  var method = data.params.method;
  if (method === "importScript") {
    importScripts(data.params.sourceUrl);
  } else if (method === "destroyInstance") {
    // close worker
    self.destroyInstance(data.params.args[0]);
    self.console.log("destroy");
  } else if (self[method]) {
    self[method].apply(null, data.params.args);
  } else {
    self.console.warn(
      "call [" + method + "] error: jsframework has no such api"
    );
  }
});

__eventEmitter__.on("WxDebug.changeLogLevel", function(message) {
  self.WXEnvironment.logLevel = message.params;
});

__eventEmitter__.on("Console.messageAdded", function(message) {
  self.console.error("[Native Error]", message.params.message.text);
});

__eventEmitter__.on("WxDebug.importScript", function(message) {
  if (message.params.sourceUrl) {
    importScripts(message.params.sourceUrl);
  } else {
    new Function("", message.params.source)();
  }
});

__eventEmitter__.on("WxDebug.initWorker", function(message) {
  var createWeexBundleEntry = function(sourceUrl) {
    var code = "";
    if (self.$$frameworkFlag[sourceUrl] || self.$$frameworkFlag["@"]) {
      code += `// { "framework": "${self.$$frameworkFlag[sourceUrl] ||
        self.$$frameworkFlag["@"]}" }\n`;
    }
    code += "__weex_bundle_entry__(";
    injectedGlobals.forEach(function(g, i) {
      code += "typeof " + g + '==="undefined"?undefined:' + g;
      if (i < injectedGlobals.length - 1) {
        code += ",";
      }
    });
    // Avoiding the structure of comments in the last line causes `}` to be annotated
    code += "\n);";
    return code;
  };
  var injectedGlobals = [
    "Promise",
    // W3C
    "window",
    "weex",
    "service",
    "Rax",
    "services",
    "global",
    "screen",
    "document",
    "navigator",
    "location",
    "fetch",
    "Headers",
    "Response",
    "Request",
    "URL",
    "URLSearchParams",
    "setTimeout",
    "clearTimeout",
    "setInterval",
    "clearInterval",
    "requestAnimationFrame",
    "cancelAnimationFrame",
    "alert",
    // ModuleJS
    "define",
    "require",
    // Weex
    "bootstrap",
    "register",
    "render",
    "__d",
    "__r",
    "__DEV__",
    "__weex_define__",
    "__weex_require__",
    "__weex_viewmodel__",
    "__weex_document__",
    "__weex_bootstrap__",
    "__weex_options__",
    "__weex_data__",
    "__weex_downgrade__",
    "__weex_require_module__",
    "Vue"
  ];
  var url = message.params.sourceUrl;
  __channelId__ = message.channelId;
  for (var key in message.params.env) {
    if (message.params.env.hasOwnProperty(key)) {
      self[key] = message.params.env[key];
    }
  }
  __rewriteLog__(message.params.env.WXEnvironment.logLevel);
  self.createInstance(
    message.params.args[0],
    createWeexBundleEntry(url),
    message.params.args[2],
    message.params.args[3]
  );
});
