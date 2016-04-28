'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.request = request;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var id = 0;

function request(url, callbackName) {
    return new _promise2.default(function (resolve, reject) {
        callbackName = callbackName || 'getscript' + id++;

        var script = document.createElement('script');

        window[callbackName] = function (text) {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve(text);
        };

        script.src = '/getScriptText?path=' + encodeURIComponent(url) + '&callback=' + callbackName;
        script.async = true;
        document.body.appendChild(script);
    });
}