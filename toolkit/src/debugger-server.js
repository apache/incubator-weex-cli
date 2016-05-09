var koa = require("koa")
var mount = require('koa-mount')
var r =   require('koa-route')
var views = require('koa-views')
var staticServer = require('koa-static')
var opener = require("opener");

const path = require('path');
// const wget = require('wget');
// const curl = require('node-curl');
const fs = require('fs');
// const del = require('del');
const http = require('http');
// const Get = require('get');
const EventEmitter = require('events');
const uuid = require('uuid');
const serve = require('koa-serve');
//const serveStatic = require('koa-serve-static');
const Router = require('koa-router');
const websockify = require('koa-websocket');
const emitter = new EventEmitter();
const app = websockify(koa());

const nwUtils =  require('./nw-utils')

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
var appPage = koa()
appPage.use(staticServer("page"))
app.use(mount('/page',appPage))

/* 
===================================
WebSocket Router
===================================
*/
var wsRouter = Router();
var frameworkWS, rendererWS;

wsRouter.all('/debugger/:id/:endpoint', function*(next) {
    var that = this;
    var ws = this.websocket;
    var id = this.params.id;
    var endpoint = this.params.endpoint;

    if(endpoint === 'framework') {
        frameworkWS = ws;
    } else if (endpoint === 'renderer') {
        rendererWS = ws;
    }

    if (endpoint !== 'framework' || id !== 0 ) {
        frameworkWS.send(JSON.stringify({
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
    var debuggerURL = 'http://localhost:4000/#0';
    opener(debuggerURL);
});

app.use(webRouter.routes());
//app.use(serveStatic(rootpath));

export function startListen(port = 4000){
    app.listen(port)
    let IP =  nwUtils.getPublicIP()
    console.log(`weex debugger server started\nplease access http://${IP}:4000/`)
}
