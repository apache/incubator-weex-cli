// mock environment
importScripts("/lib/constructors/_EventEmitter.js");
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

__eventEmitter__.on("WxDebug.initSandboxWorker", function(message) {
  var instanceid = message.params.args[0];
  var options = message.params.args[1];
  var instanceData = message.params.args[2];
  var instanceContext = self.createInstanceContext(
    instanceid,
    options,
    instanceData
  );

  __channelId__ = message.channelId;
  for (var prop in instanceContext) {
    if (instanceContext.hasOwnProperty(prop) && prop !== "callNative") {
      self[prop] = instanceContext[prop];
    }
  }
  for (var key in message.params.env) {
    if (message.params.env.hasOwnProperty(key)) {
      self[key] = message.params.env[key];
    }
  }
  if (message.params.dependenceUrl) {
    importScripts(message.params.dependenceUrl);
  }
  __rewriteLog__(message.params.env.WXEnvironment.logLevel);
});
