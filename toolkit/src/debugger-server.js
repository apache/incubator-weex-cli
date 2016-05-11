const koa = require("koa")
const mount = require('koa-mount')
const r =   require('koa-route')
const views = require('koa-views')
const staticServer = require('koa-static')
const opener = require("opener");

const path = require('path');
const fs = require('fs');
const http = require('http');
const EventEmitter = require('events');
const uuid = require('uuid');

const Router = require('koa-router');
const websockify = require('./libs/koa-websocket');
const emitter = new EventEmitter();
const app = websockify(koa());

const nwUtils =  require('./nw-utils')

var DEBUGGER_SERVER_PORT = 4000

// Debugger Server
var DS = { 
  index: function *(){
      yield this.render("weex-debugger")
  }
};
app.use(views( path.join(__dirname , "../","page") ,{ pagemap: {html: 'underscore'} }))
app.use(r.get('/',DS.index))

var appStatic = koa()
appStatic.use(staticServer(path.join(__dirname , "../","build")))
app.use(mount('/static',appStatic))

/* 
===================================
WebSocket Router
===================================
*/
var wsRouter = Router();

wsRouter.all('/debugger/:id/:endpoint', function*(next) {
    var that = this;
    var ws = this.websocket;
    var id = this.params.id;
    var endpoint = this.params.endpoint;
    if (endpoint !== 'framework' || id !== 0 ) {
        ws.send(JSON.stringify({
            method: '__connect',
            arguments: [endpoint]
        }));
    }

    function subscriberHandler(event) {
        // 同一个debugger（id相同）下，向不同的终端（endpoint不同）发送
        var message = event.message;

        if (event.id === id && 
                event.endpoint !== endpoint) {
            ws.send(message);
        }
    }

    ws.on('message', function(message) {
        // 接受来自各个端的消息，通知所有订阅者
        // console.log(JSON.parse(message).name)
        var event = {
            endpoint: endpoint,
            id: id,
            message: message
        }
        emitter.emit('debugger', event);
    });

    ws.on('error', function(err) {
        logger.log('error:' + err);
    });

    ws.on('close', function() {
        emitter.removeListener('debugger', subscriberHandler);
    });

    emitter.on('debugger', subscriberHandler);

    yield next;
});

app.ws.use(wsRouter.routes());


/* 
===================================
Http Router
===================================
*/
var rootpath = path.dirname(__dirname);
var webRouter = Router();
webRouter.get('/getScriptText', function*(next) {

    var callback = this.query.callback;
    var scriptPath = this.query.path;

    var body = yield new Promise(function(resolve, reject) {
        http.get(scriptPath, function(res) {
            var chunks = [];

            res.setEncoding('utf8');

            res.on('data', function(chunk) {
                chunks.push(chunk);
            });

            res.on('end', function() {
                resolve(chunks.join(''));
            });
        }).on('error', function(e) {
            reject(e.message);
        });
    });

    this.response.status = 200;
    this.response.contentType = 'text/javascript';
    if (callback) {
        body = JSON.stringify(body.replace(/;+$/, ''));
        this.response.body = `${callback}(${body})`; 
    } else {
        this.response.body = body;
    }
});

webRouter.get('/launchDebugger', function*(next) {
    let IP =  nwUtils.getPublicIP()    
    var debuggerURL = `http://${IP}:${DEBUGGER_SERVER_PORT}/#0`;
    opener(debuggerURL);
});

app.use(webRouter.routes());

export function startListen(port = DEBUGGER_SERVER_PORT){
    DEBUGGER_SERVER_PORT = port
    app.listen(port)
    let IP =  nwUtils.getPublicIP()
    console.log(`weex debugger server started\nplease access http://${IP}:${port}/`)
}
