'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.default = WebsocketLogger;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function WebsocketLogger(endpoint, id) {
    var serverUrl = WebsocketLogger.getServerUrl(endpoint, id);
    var websocket = new WebSocket(serverUrl);

    var emitter = new _events2.default();

    this.log = function () {
        websocket.send((0, _stringify2.default)(arguments));
    };

    this.on = function (handler) {
        emitter.on('log', handler);
    };

    websocket.addEventListener('open', function () {
        console.log('logger open');
    });

    websocket.addEventListener('message', function (event) {
        var message = JSON.parse(event.data);
        emitter.emit('log', message);
    });
}

WebsocketLogger.getServerUrl = function (endpoint, id) {
    var hostname = location.hostname;
    var port = location.port;
    var host = hostname + (port ? ':' + port : '');
    return 'ws://' + host + '/logger/' + id + '/' + endpoint;
};