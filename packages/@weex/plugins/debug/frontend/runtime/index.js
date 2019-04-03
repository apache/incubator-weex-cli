var workers = {};
var instanceMaps = {};
var RuntimeSocket
var BrowserChannelId
var cacheWeexEnv;
var cacheJsbundleImportMessage;
var cacheRegisterLoop = [];
var cacheSyncList = [];
var activeWorkerId;
var cacheLogLevel;
var EntrySocket = new WebsocketClient('ws://' + location.host + '/page/entry');

EntrySocket.on('WxDebug.startDebugger', function (message) {
  if (!RuntimeSocket) {
    location.href = `http://${location.host}/runtime/runtime.html?channelId=${message.params}`
  } else if (RuntimeSocket && BrowserChannelId !== message.params) {
    location.href = `http://${location.host}/runtime/runtime.html?channelId=${message.params}`
  }
})

BrowserChannelId = new URLSearchParams(location.search).get('channelId');

if (BrowserChannelId) {
  connect(BrowserChannelId)
}

function connect(channelId) {
  RuntimeSocket = new WebsocketClient('ws://' + window.location.host + '/debugProxy/runtime/' + channelId);

  RuntimeSocket.on('*', function (message) {
    if (!message) return;
    var domain = message.method.split('.')[0];
    if (domain === 'WxDebug') {
      var instanceId;
      if (message.params && message.params.args) {
        instanceId = message.params.args[0];
      } else {
        instanceId = activeWorkerId
      }
      if (workers[instanceId]) {
        workers[instanceId].postMessage(message);
      }
    }
  });

  RuntimeSocket.on('WxDebug.deviceDisconnect', function () {
    location.href = `http://${location.host}/runtime/runtime.html`
  })

  RuntimeSocket.on('WxDebug.setLogLevel', function (message) {
    cacheLogLevel = message.params.logLevel
    if (activeWorkerId && workers[activeWorkerId]) {
      workers[activeWorkerId].postMessage(message);
    }
  })

  RuntimeSocket.on('WxDebug.refresh', function () {
    location.reload();
  });

  RuntimeSocket.on('WxDebug.callJS', function (message) {
    var instanceId = message.params.args[0];
    if (message.params.method === 'createInstanceContext') {
      destroyJSRuntime(message)
      message.channelId = BrowserChannelId;
      message.method = 'WxDebug.initSandboxWorker';
      message.params.env = cacheWeexEnv;
      message.params.syncList = cacheSyncList.splice(0, cacheSyncList.length);
      initJSRuntime(message)
    } else if (message.params.method === 'createInstance') {
      destroyJSRuntime(message)
      message.channelId = BrowserChannelId;
      message.method = 'WxDebug.initWorker';
      message.params.env = cacheWeexEnv;
      initJSRuntime(message)
    } else if (message.params.method === 'importScript') {
      if (workers[instanceId]) {
        workers[instanceId].postMessage(message)
      } else {
        cacheJsbundleImportMessage = message;
      }
    } else if (message.params.method === 'destroyInstance') {
      destroyJSRuntime(message);
    } else if (message.params.args && (message.params.method === 'registerComponents' || message.params.method === 'registerModules' || message.params.method === 'getJSFMVersion' || message.params.method === 'getJSFMVersion')) {
      cacheRegisterLoop.push(message);
    } else {
      if (message.params && message.params.args && message.params.args[0] && workers[message.params.args[0]]) {
        workers[message.params.args[0]].postMessage(message);
      } else if (activeWorkerId && workers[activeWorkerId]) {
        workers[activeWorkerId].postMessage(message);
      }
    }
  });

  RuntimeSocket.on('WxDebug.initJSRuntime', function (message) {
    var logLevel = localStorage.getItem('logLevel');
    if (logLevel) {
      message.params.env.WXEnvironment.logLevel = logLevel;
    }
    cacheWeexEnv = message.params.env;
    cacheRegisterLoop = [];
  });
}

function destroyJSRuntime(message) {
  var instanceId = message.params.args[0];
  var workerjs = message.params.workerjs;
  if (workerjs) {
    instanceId = instanceMaps[workerjs]
  }
  if (workers[instanceId]) {
    if (workers[instanceId].prev) {
      activeWorkerId = workers[instanceId].prev;
    } else {
      activeWorkerId = null;
    }
    workers[instanceId].terminate();
    delete workers[instanceId];
  }
}

function initJSRuntime(message) {
  var instanceId = activeWorkerId = message.params.args[0];
  instanceMaps[message.params.workerjs] = instanceId;
  workers[instanceId] = new Worker(message.params.workerjs);
  workers[instanceId]['prev'] = getPrevWorker(workers);
  workers[instanceId].onmessage = function (message) {
    message = message.data;
    RuntimeSocket.send(message);
  };
  cacheRegisterLoop.forEach(function (message) {
    workers[instanceId].postMessage(message)
  })
  if (cacheJsbundleImportMessage) {
    workers[instanceId].postMessage(message);
  }
  if (cacheLogLevel) {
    message.params.env.WXEnvironment.logLevel = cacheLogLevel;
  }
  workers[instanceId].postMessage(message);
}

function getPrevWorker(workers) {
  var lists = Object.keys(workers);
  if (lists.length === 0) return null;
  for (var i = lists.length - 2; i >= 0; i--) {
    if (workers[lists[lists.length - 2]]) {
      return lists[lists.length - 2];
    }
  }
  return null;
}
