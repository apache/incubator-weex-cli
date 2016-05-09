'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.default = WebsocketClient;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function WebsocketClient(endpoint, id) {
    var serverUrl = WebsocketClient.getServerUrl(endpoint, id);
    var websocket = new WebSocket(serverUrl);

    var emitter = new _events2.default();

    this.send = function (method, args) {
        var message = {
            method: method,
            arguments: args
        };

        websocket.send((0, _stringify2.default)(message));
    };

    this.on = function (name, handler) {
        emitter.on(name, handler);
    };

    websocket.addEventListener('open', function () {
        console.log('debugger open');
        $("#status").text("connected").removeClass("warning");
    });

    websocket.addEventListener('message', function (event) {
        var message = JSON.parse(event.data);
        emitter.emit(message.method, message.arguments);
    });

    websocket.addEventListener('close', function () {
        console.log('debugger close');
        return $("#status").text("disconnected").addClass("warning");
    });
}

WebsocketClient.getServerUrl = function (endpoint, id) {
    var hostname = location.hostname;
    var port = location.port;
    var host = hostname + (port ? ':' + port : '');

    return 'ws://' + host + '/debugger/' + id + '/' + endpoint;
};