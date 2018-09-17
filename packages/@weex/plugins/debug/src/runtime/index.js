exports.getRuntimeContent = async () => {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Weex Devtool - JS Debugger</title>
  <script>
    function EventEmitter() {
      this._handlers = {};
    }
    EventEmitter.prototype = {
        constructor: EventEmitter,
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
    function WebsocketClient(url) {
      this.connect(url);
    }
    WebsocketClient.prototype = {
        constructor: WebsocketClient,
        connect: function (url) {
            var self = this;
            self.isSocketReady = false;
            self._sended = [];
            self._received = [];
            if (self.ws) {
                self.ws.onopen = null;
                self.ws.onmessage = null;
                self.ws.onclose = null;
                if (self.ws.readyState == WebSocket.OPEN) {
                    self.ws.close();
                }
            }
            var ws = new WebSocket(url);
            self.ws = ws;
            ws.onopen = function () {
                self.isSocketReady = true;
                self.emit('socketOpened');
            };
            ws.onmessage = function (e) {
                var message = JSON.parse(e.data);
                if (message.method) {
                    self.emit(message.method, message);
                }
            };
            ws.onclose = function () {
                self.isSocketReady = false;
                self.emit('socketClose');
            };
    
        },
        send: function (data) {
            var self = this;
            if (self.isSocketReady) {
                self.ws.send(JSON.stringify(data));
            }
            else {
                self.once('socketOpened', function () {
                    self.ws.send(JSON.stringify(data))
                });
            }
        },
        close: function () {
            this.ws && this.ws.close();
        }
    };
    WebsocketClient.prototype.__proto__ = new EventEmitter();
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
        location.href = 'http://' + window.location.host + '/runtime';
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


  </script>
  </head>
  <body>
      <div>
          This page is use for start Workers for debugger.
      </div>
  </body>
  </html>`
}
