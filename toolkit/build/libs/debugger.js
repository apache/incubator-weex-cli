'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.logger = exports.wsc = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.init = init;
exports.evalFramework = evalFramework;
exports.evalRenderer = evalRenderer;

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function debuggableDecorator(target, name, descriptor) {
    descriptor = descriptor;
    var fn = descriptor.value;

    descriptor.value = function () {
        logger.log('proxy ' + name, [].concat(Array.prototype.slice.call(arguments)));
        wsc.send(name, [].concat(Array.prototype.slice.call(arguments)));
    };

    wsc.on(name, function (args) {
        logger.log('adapt ' + name, args);
        fn && fn.apply(undefined, (0, _toConsumableArray3.default)(args));
    });

    descriptor.enumerable = true;
    descriptor.writable = false;
    return descriptor;
}

function defineProperty(scope, name, descriptor) {
    descriptor = debuggableDecorator(scope, name, descriptor);
    var __original__ = scope.__original__ || (scope.__original__ = {});
    (0, _defineProperty2.default)(__original__, name, {
        value: scope[name]
    });
    (0, _defineProperty2.default)(scope, name, descriptor);
}

var instanceId;
function registerMethods(scope, debuggableScope) {
    for (var methodName in debuggableScope) {
        var methodFunction = debuggableScope[methodName];

        if (typeof methodFunction === 'function') {
            var scopeFunction = scope[methodName] || (scope[methodName] = function () {});
            var descriptor = {
                value: methodFunction.bind(debuggableScope, scopeFunction)
            };
            defineProperty(scope, methodName, descriptor);
        } else if (typeof methodFunction === 'boolean') {
            var _scopeFunction = scope[methodName] || (scope[methodName] = function () {});
            var _descriptor = {
                value: _scopeFunction
            };
            defineProperty(scope, methodName, _descriptor);
        } else if ((typeof methodFunction === 'undefined' ? 'undefined' : (0, _typeof3.default)(methodFunction)) === 'object') {
            var _scopeFunction2 = scope[methodName] || (scope[methodName] = {});
            registerMethods(_scopeFunction2, methodFunction);
        }
    }
}

var wsc = exports.wsc = undefined;
var logger = exports.logger = undefined;
function init(endpoint, id, frameworkCode, rendererCode) {
    exports.logger = logger = new _logger2.default(endpoint, id);
    exports.wsc = wsc = new _client2.default(endpoint, id);

    if (frameworkCode) {
        evalFramework(frameworkCode);
    } else {
        wsc.on('evalFramework', function (args) {
            evalFramework.apply(undefined, (0, _toConsumableArray3.default)(args));
        });
    }

    if (rendererCode) {
        evalRenderer(rendererCode);
    } else {
        wsc.on('evalRenderer', function (args) {
            evalRenderer.apply(undefined, (0, _toConsumableArray3.default)(args));
        });
    }
}

function evalCode(code) {
    var scope;
    if (typeof global !== 'undefined') {
        scope = global;
    } else if (typeof window !== 'undefined') {
        scope = window;
    } else {
        scope = {};
    }
    var evalFunction = scope.eval || global.eval || window.eval;
    if (typeof evalFunction === 'function') {
        evalFunction(code);
    }
    return scope;
}

var instanceId;

var debuggableScope = {
    createInstance: function createInstance(scopeFunction) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        instanceId = args[0];
        return scopeFunction && scopeFunction.apply(undefined, args);
    },

    refreshInstance: true,
    destroyInstance: true,
    registerComponents: true,
    registerModules: true,
    instanceMap: true,
    callNative: true,
    callJS: true,
    setEnvironment: function setEnvironment(scopeFunction, env) {
        global.WXEnvironment = env;
    }
};

function evalFramework(frameworkCode) {
    var scope;
    if (typeof frameworkCode === 'string') {
        scope = evalCode(frameworkCode);
    } else {
        scope = global || window;
    }
    registerMethods(scope, debuggableScope);

    window.getRootElement = function () {
        return window.getRoot(instanceId);
    };
}

function evalRenderer(rendererCode) {
    var scope;
    if (typeof frameworkCode === 'string') {
        scope = evalCode(rendererCode);
    } else {
        scope = global || window;
    }
    registerMethods(scope, debuggableScope);
}