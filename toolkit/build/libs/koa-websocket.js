'use strict';

var url = require('url'),
    compose = require('koa-compose'),
    co = require('co'),
    ws = require('ws');
var WebSocketServer = ws.Server;
var debug = require('debug')('koa:websockets');

function KoaWebSocketServer(app) {
  this.app = app;
  this.middleware = [];
}

KoaWebSocketServer.prototype.listen = function (server) {
  this.server = new WebSocketServer({
    server: server
  });
  this.server.on('connection', this.onConnection.bind(this));
};

KoaWebSocketServer.prototype.onConnection = function (socket) {
  debug('Connection received');
  socket.on('error', function (err) {
    debug('Error occurred:', err);
  });
  var fn = co.wrap(compose(this.middleware));

  var context = this.app.createContext(socket.upgradeReq);
  context.websocket = socket;
  context.path = url.parse(socket.upgradeReq.url).pathname;

  fn.bind(context).call().catch(function (err) {
    debug(err);
  });
};

KoaWebSocketServer.prototype.use = function (fn) {
  this.middleware.push(fn);
  return this;
};

module.exports = function (app) {
  var oldListen = app.listen;
  app.listen = function () {
    debug('Attaching server...');
    app.server = oldListen.apply(app, arguments);
    app.ws.listen(app.server);
    return app.server;
  };
  app.ws = new KoaWebSocketServer(app);
  return app;
};