var workers = {};
var instanceMaps = {};
var RuntimeSocket
var BrowserChannelId
var cacheWeexEnv;
var cacheJsbundleImportMessage;
var cacheRegisterLoop = [];
var cacheSyncList = [];
var activeWorkerId;

var heartbeatTimer = null
var wmlCacheEnv;
var wmlWorkers = {};
var wmlAppMaps = {};
BrowserChannelId = new URLSearchParams(location.search).get('channelId');

if (BrowserChannelId) {
  connect(BrowserChannelId)
}

function connect(channelId) {
  RuntimeSocket = new WebsocketClient('ws://' + window.location.host + '/debugProxy/runtime/' + channelId);

  RuntimeSocket.on('*', function (message) {
    if (!message) return;
    var domain = message.method.split('.')[0];
    var appId;
    if (message && message.params && message.params.appId) {
      appId = message.params.appId;
    } else {
      appId = activeWorkerId
    }
    if (wmlWorkers[appId]) {
      wmlWorkers[appId].postMessage(message);
    }
    heartbeat()
  });

  RuntimeSocket.on('WMLDebug.deviceDisconnect', function () {
    location.href = `http://${location.host}/runtime.html`
  })

  RuntimeSocket.on('WMLDebug.initRuntimeWorker', function (message) {
    if (message.params.appId) {
      activeWorkerId = message.params.appId;
    }
    wmlCacheEnv = message.params.env;
  });

  RuntimeSocket.on('WMLDebug.initAppFrameworkWorker', function (message) {
    if (message.params.appId) {
      activeWorkerId = message.params.appId;
    }
    if (message.params.workerjs) {
      destoryWmlRuntime(message)
      message.channelId = BrowserChannelId;
      message.method = 'WMLDebug.initSandboxWorker';
      message.params.env = wmlCacheEnv;
      initWmlRuntime(message)
    }
  });

  RuntimeSocket.on('WMLDebug.destoryAppContext', function (message) {
    destoryWmlRuntime(message)
  });

}

function heartbeat() {
  heartbeatTimer && clearInterval(heartbeatTimer)
  heartbeatTimer = setInterval(() => {
    RuntimeSocket && RuntimeSocket.send({
      method: 'WMLDebug.heartbeat'
    })
  }, 30000)
}

function initWmlRuntime(message) {
  var appId = message.params.appId;
  wmlAppMaps[message.params.workerjs] = appId;
  wmlWorkers[appId] = new Worker(message.params.workerjs);
  wmlWorkers[appId]['prev'] = getPrevWorker(wmlWorkers);
  wmlWorkers[appId].onmessage = function (message) {
    message = message.data;
    RuntimeSocket.send(message);
  };
  wmlWorkers[appId].postMessage(message);
}

function destoryWmlRuntime(message) {
  var appId = message.params.appId;
  var workerjs = message.params.workerjs;
  if (workerjs) {
    appId = wmlAppMaps[workerjs]
  }
  if (wmlWorkers[appId]) {
    if (wmlWorkers[appId].prev) {
      activeWorkerId = wmlWorkers[appId].prev;
    } else {
      activeWorkerId = null;
    }
    wmlWorkers[appId].terminate();
    delete wmlWorkers[appId];
  }
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
