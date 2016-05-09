var koa = require("koa")
var mount = require('koa-mount')
var r =   require('koa-route')
var views = require('koa-views')
var staticServer = require('koa-static')

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

app.use(views("page",{ pagemap: {html: 'underscore'} }))
app.use(r.get('/',DS.index))
var appStatic = koa()
appStatic.use(staticServer("build"))
app.use(mount('/static',appStatic))
var appPage = koa()
appPage.use(staticServer("page"))
app.use(mount('/page',appPage))


function WSLogger(ws, id, endpoint) {
    this.log = function(message) {
        var event = {
            endpoint: endpoint,
            id: id,
            message: message
        };
        // console.log(event)
        emitter.emit('logger', event);
    }
}

/* 
===================================
WebSocket Router
===================================
*/
var wsRouter = Router();
wsRouter.all('/logger/:id/:endpoint', function*(next) {
    var that = this;
    var ws = this.websocket;
    var id = this.params.id;
    var endpoint = this.params.endpoint;

    var logger = new WSLogger(ws, id, endpoint);

    function handler(event) {
        if (event.id === id) {
            ws.send(JSON.stringify(event));    
        }
    }

    ws.on('message', function(message) {
        // 接受来自各个端的debugger信息
        logger.log(message);
    });

    ws.on('close', function() {
        emitter.removeListener('logger', handler);
    });

    emitter.on('logger', handler);

    yield next;
});

wsRouter.all('/debugger/:id/:endpoint', function*(next) {
    var that = this;
    var ws = this.websocket;
    var id = this.params.id;
    var endpoint = this.params.endpoint;

    var logger = new WSLogger(ws, id, 'server');

    logger.log(endpoint + ' connected');

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
app.use(webRouter.routes());
//app.use(serveStatic(rootpath));


app.listen(4000)
let IP =  nwUtils.getPublicIP()
console.log(`http listening http://${IP}:4000/`)
