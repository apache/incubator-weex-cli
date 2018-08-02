var workers = {};
var RuntimeSocket
var BrowserChannelId
var cacheWeexEnv;
var cacheJsbundleImportMessage;
var cacheRegisterLoop = [];
var activeWorkerId;

BrowserChannelId = new URLSearchParams(location.search).get('channelId');

if (BrowserChannelId) {
  connect(BrowserChannelId)
}

function connect(channelId) {
  RuntimeSocket = new WebsocketClient('ws://' + window.location.host + '/debugProxy/runtime/' + channelId);
  
  RuntimeSocket.on('*', function (message) {
    if (!message) return;
    var instanceId;
    if (message && message.params) {
      instanceId = message.params && message.params.args && message.params.args[0];
    }
    else {
      instanceId = activeWorkerId
    }
    if (workers[instanceId]) {
      workers[instanceId].postMessage(message);
    }
  });

  RuntimeSocket.on('WxDebug.deviceDisconnect', function () {
    location.href = `http://${location.host}/runtime.html`
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
      initJSRuntime(message)
    }
    else if(message.params.method === 'createInstance') {
      destroyJSRuntime(message)
      message.channelId = BrowserChannelId;
      message.method = 'WxDebug.initWorker';
      message.params.env = cacheWeexEnv;
      initJSRuntime(message)
    }
    else if(message.params.method === 'importScript') {
      if (workers[instanceId]) {
        workers[instanceId].postMessage(message)
      }
      else {
        cacheJsbundleImportMessage = message;
      }
    }
    else if(message.params.method === 'destroyInstance') {
      destroyJSRuntime(message);
    }
    else if (message.params.args && (message.params.method === 'registerComponents' || message.params.method === 'registerModules' || message.params.method === 'getJSFMVersion' || message.params.method === 'getJSFMVersion')) {
      cacheRegisterLoop.push(message);
    }
    else {
      if (activeWorkerId) {
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
  if (workers[instanceId]) {
    if (workers[instanceId].prev) {
      activeWorkerId = workers[instanceId].prev;
    }
    else {
      activeWorkerId = null;
    }
    workers[instanceId].terminate();
    delete workers[instanceId];
  }
}

function initJSRuntime(message) {
  var instanceId = activeWorkerId = message.params.args[0];
  workers[instanceId] = new Worker(message.params.workerjs);
  workers[instanceId]['prev'] = getPrevWorker(workers);
  workers[instanceId].onmessage = function (message) {
    message = message.data;
    RuntimeSocket.send(message);
  };
  cacheRegisterLoop.forEach(function(message) {
    workers[instanceId].postMessage(message)
  })
  workers[instanceId].postMessage(message);
  if (cacheJsbundleImportMessage) {
    workers[instanceId].postMessage(message);
  }
}

function getPrevWorker(workers) {
  var lists = Object.keys(workers);
  if (lists.length === 0) return null;
  for(var i = lists.length - 2; i >=0; i--) {
    if (workers[lists[lists.length - 2]]) {
      return lists[lists.length - 2];
    }
  }
  return null;
}

