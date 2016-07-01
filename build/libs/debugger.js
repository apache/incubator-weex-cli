'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.wsc = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.init = init;
exports.evalFramework = evalFramework;
exports.evalRenderer = evalRenderer;
exports.setLogLevel = setLogLevel;

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _qrcode = require('./qrcode');

var _qrcode2 = _interopRequireDefault(_qrcode);

var _debuggerPage = require('../debugger-page');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function debuggableDecorator(target, name, descriptor) {
    descriptor = descriptor;
    var fn = descriptor.value;

    descriptor.value = function () {
        wsc.send(name, [].concat(Array.prototype.slice.call(arguments)));
    };

    wsc.on(name, function (args) {
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
function init(endpoint, id, frameworkCode, rendererCode) {
    exports.wsc = wsc = new _client2.default(endpoint, id);

    var scope;
    if (typeof global !== 'undefined') {
        scope = global;
    } else if (typeof window !== 'undefined') {
        scope = window;
    } else {
        scope = {};
    }
    registerMethods(scope, debuggableScope);
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
    __logger: function __logger(scopeFunction, flag, message) {
        if (!hideNativeQRCode.hidden) {
            hideNativeQRCode();
        }
        printLog(flag, message);
    },
    __connect: function __connect(scopeFunction, message) {
        if (message === 'framework') {
            generateNativeQRCode();
        } else if (message === 'renderer') {
            hideNativeQRCode();
        }
    },
    setEnvironment: function setEnvironment(scopeFunction, env) {
        global.WXEnvironment = env;
        var deviceLevel = env.logLevel;
        _debuggerPage.vueInstance.deviceLevel = deviceLevel;
        _debuggerPage.vueInstance.updateDeviceLevel();
    }
};

function printLog(flag, message) {
    var div, html;
    if (flag == null) {
        flag = 'info';
    }
    _debuggerPage.vueInstance.logs.push({ content: message, flag: flag });
}

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

//TODO: not a suitable place , need refactoring
function setLogLevel(logLevel) {
    wsc.send('setLogLevel', [logLevel]);
}

function generateNativeQRCode() {
    var host = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    var ID = location.hash.replace('#', '') || uuid.v1();
    var rendererUrl = _client2.default.getServerUrl('renderer', ID);
    var qrUrl = 'http://weex-remote-debugger?_wx_debug=' + encodeURIComponent(rendererUrl);

    var $slogan = document.querySelector('#slogan');
    $slogan.style.display = 'flex';

    var $qrcode = document.querySelector('#qrcode');
    var el = (0, _qrcode2.default)(qrUrl);
    $qrcode.innerHTML = '';
    $qrcode.appendChild(el);
}

hideNativeQRCode.hidden = false;
function hideNativeQRCode() {
    $('#slogan').hide();
    $("#logs").show();
    (0, _debuggerPage.setLoggerHeight)();
    $(window).resize(function () {
        (0, _debuggerPage.setLoggerHeight)();
    });

    $("#page-title").css("left", ($(window).width() - 350) / 2 + 'px');

    setTimeout(function () {
        $("#page-title").css("transition", "all 2s");
        $("#page-title").css("left", "25px");
        setTimeout(function () {
            $("#page-title").css("left", "105px");
            $("#page-title").addClass("vertical");
            $("#logs").css("top", "20px");
        }, 1000);
    }, 1000);

    hideNativeQRCode.hidden = true;
}

window._hideNativeQRCode = hideNativeQRCode; //just for debug debugger