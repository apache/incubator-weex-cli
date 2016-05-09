'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.startListen = startListen;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var koa = require("koa");
var mount = require('koa-mount');
var r = require('koa-route');
var views = require('koa-views');
var staticServer = require('koa-static');
var opener = require("opener");

var path = require('path');
// const wget = require('wget');
// const curl = require('node-curl');
var fs = require('fs');
// const del = require('del');
var http = require('http');
// const Get = require('get');
var EventEmitter = require('events');
var uuid = require('uuid');
var serve = require('koa-serve');
//const serveStatic = require('koa-serve-static');
var Router = require('koa-router');
var websockify = require('koa-websocket');
var emitter = new EventEmitter();
var app = websockify(koa());

var nwUtils = require('./nw-utils');

// Debugger Server
var DS = {
    index: _regenerator2.default.mark(function index() {
        return _regenerator2.default.wrap(function index$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return this.render("weex-debugger");

                    case 2:
                    case 'end':
                        return _context.stop();
                }
            }
        }, index, this);
    })
};

app.use(views(path.join(__dirname, "../", "page"), { pagemap: { html: 'underscore' } }));
app.use(r.get('/', DS.index));
var appStatic = koa();
appStatic.use(staticServer(path.join(__dirname, "../", "build")));
app.use(mount('/static', appStatic));
var appPage = koa();
appPage.use(staticServer("page"));
app.use(mount('/page', appPage));

/* 
===================================
WebSocket Router
===================================
*/
var wsRouter = Router();
var frameworkWS, rendererWS;

wsRouter.all('/debugger/:id/:endpoint', _regenerator2.default.mark(function _callee(next) {
    var that, ws, id, endpoint, subscriberHandler;
    return _regenerator2.default.wrap(function _callee$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    subscriberHandler = function subscriberHandler(event) {
                        // 同一个debugger（id相同）下，向不同的终端（endpoint不同）发送
                        var message = event.message;

                        if (event.id === id && event.endpoint !== endpoint) {
                            ws.send(message);
                        }
                    };

                    that = this;
                    ws = this.websocket;
                    id = this.params.id;
                    endpoint = this.params.endpoint;


                    if (endpoint === 'framework') {
                        frameworkWS = ws;
                    } else if (endpoint === 'renderer') {
                        rendererWS = ws;
                    }

                    if (endpoint !== 'framework' || id !== '0') {
                        frameworkWS.send((0, _stringify2.default)({
                            method: '__connect',
                            arguments: [endpoint]
                        }));
                    }

                    ws.on('message', function (message) {
                        // 接受来自各个端的消息，通知所有订阅者
                        // console.log(JSON.parse(message).name)
                        var event = {
                            endpoint: endpoint,
                            id: id,
                            message: message
                        };
                        emitter.emit('debugger', event);
                    });

                    ws.on('error', function (err) {
                        logger.log('error:' + err);
                    });

                    ws.on('close', function () {
                        emitter.removeListener('debugger', subscriberHandler);
                    });

                    emitter.on('debugger', subscriberHandler);

                    _context2.next = 13;
                    return next;

                case 13:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _callee, this);
}));

app.ws.use(wsRouter.routes());

/* 
===================================
Http Router
===================================
*/
var rootpath = path.dirname(__dirname);
var webRouter = Router();
webRouter.get('/getScriptText', _regenerator2.default.mark(function _callee2(next) {
    var callback, scriptPath, body;
    return _regenerator2.default.wrap(function _callee2$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    callback = this.query.callback;
                    scriptPath = this.query.path;
                    _context3.next = 4;
                    return new _promise2.default(function (resolve, reject) {
                        http.get(scriptPath, function (res) {
                            var chunks = [];

                            res.setEncoding('utf8');

                            res.on('data', function (chunk) {
                                chunks.push(chunk);
                            });

                            res.on('end', function () {
                                resolve(chunks.join(''));
                            });
                        }).on('error', function (e) {
                            reject(e.message);
                        });
                    });

                case 4:
                    body = _context3.sent;


                    this.response.status = 200;
                    this.response.contentType = 'text/javascript';
                    if (callback) {
                        body = (0, _stringify2.default)(body.replace(/;+$/, ''));
                        this.response.body = callback + '(' + body + ')';
                    } else {
                        this.response.body = body;
                    }

                case 8:
                case 'end':
                    return _context3.stop();
            }
        }
    }, _callee2, this);
}));

webRouter.get('/launchDebugger', _regenerator2.default.mark(function _callee3(next) {
    var debuggerURL;
    return _regenerator2.default.wrap(function _callee3$(_context4) {
        while (1) {
            switch (_context4.prev = _context4.next) {
                case 0:
                    debuggerURL = 'http://localhost:4000/#0';

                    opener(debuggerURL);

                case 2:
                case 'end':
                    return _context4.stop();
            }
        }
    }, _callee3, this);
}));

app.use(webRouter.routes());
//app.use(serveStatic(rootpath));

function startListen() {
    var port = arguments.length <= 0 || arguments[0] === undefined ? 4000 : arguments[0];

    app.listen(port);
    var IP = nwUtils.getPublicIP();
    console.log('weex debugger server started\nplease access http://' + IP + ':4000/');
}