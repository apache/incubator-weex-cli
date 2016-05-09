import WebsocketClient from './client';
import WebsocketLogger from './logger';

function debuggableDecorator(target, name, descriptor) {
    descriptor = descriptor
    var fn = descriptor.value;

    descriptor.value = function() {
        logger.log(`proxy ${name}`, [...arguments]);
        wsc.send(name, [...arguments]);
    }

    wsc.on(name, function(args) {
        logger.log(`adapt ${name}`, args);
        fn && fn(...args);
    });

    descriptor.enumerable = true;
    descriptor.writable = false;
    return descriptor;
}

function defineProperty(scope, name, descriptor) {
    descriptor = debuggableDecorator(scope, name, descriptor);
    var __original__ = scope.__original__ || (scope.__original__ = {});
    Object.defineProperty(__original__, name, {
        value: scope[name]
    });
    Object.defineProperty(scope, name, descriptor);
}

var instanceId;
function registerMethods(scope, debuggableScope) {
    for (let methodName in debuggableScope) {
        let methodFunction = debuggableScope[methodName];

        if (typeof methodFunction === 'function') {
            let scopeFunction = scope[methodName] || (scope[methodName] = function() {});
            let descriptor = {
                value: methodFunction.bind(debuggableScope, scopeFunction)
            }
            defineProperty(scope, methodName, descriptor);
        } else if (typeof methodFunction === 'boolean') {
            let scopeFunction = scope[methodName] || (scope[methodName] = function() {});
            let descriptor = {
                value: scopeFunction
            }
            defineProperty(scope, methodName, descriptor);
        } else if (typeof methodFunction === 'object') {
            let scopeFunction = scope[methodName] || (scope[methodName] = {});
            registerMethods(scopeFunction, methodFunction);
        }
    }    
}

export var wsc;
export var logger;
export function init(endpoint, id, frameworkCode, rendererCode) {
    logger = new WebsocketLogger(endpoint, id);
    wsc = new WebsocketClient(endpoint, id);

    if (frameworkCode) {
        evalFramework(frameworkCode);
    } else {
        wsc.on('evalFramework', function(args) {
            evalFramework(...args);
        });
    }

    if (rendererCode) {
        evalRenderer(rendererCode);
    } else {
        wsc.on('evalRenderer', function(args) {
            evalRenderer(...args);
        });
    }
}

function evalCode(code) {

    //var e = document.createElement('script');
    //e.type = 'text/javascript';
    //e.src  = 'data:text/javascript;charset=utf-8,'+escape(code);
    //document.body.appendChild(e);

    var scope;
    if (typeof global !== 'undefined') {
        scope = global;
    } else if (typeof window !== 'undefined') {
        scope = window;
    } else  {
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
    createInstance (scopeFunction, ...args) {
        instanceId = args[0];
        return scopeFunction && scopeFunction(...args);
    },
    refreshInstance: true,
    destroyInstance: true,
    registerComponents: true,
    registerModules: true,
    instanceMap: true,
    callNative: true,
    callJS: true,
    __logger (scopeFunction, flag, message) {
        printLog(flag, message);
    },
    setEnvironment (scopeFunction, env) {
        global.WXEnvironment = env;
        var deviceLevel = env.logLevel;
        $("#device-level-" + deviceLevel).attr('checked', 'checked');
        $("#device-level-" + deviceLevel).parent().addClass('active');
    }
}

function printLog(flag, message) {
    var div, html;
    if (flag == null) {
        flag = 'info';
    }

    html = $("<div/>").text(message).html();
    $("#logger").append("<p class='" + flag + " log'>" + html + "</p>");
    div = $("#logger")[0];
    return div.scrollTop = div.scrollHeight;
    //console.log(flag, message);
}

export function evalFramework(frameworkCode) {
    var scope;
    if (typeof frameworkCode === 'string') {
        scope = evalCode(frameworkCode);
    } else {
        scope = global || window;
    }
    registerMethods(scope, debuggableScope);

    window.getRootElement = function() {
        return window.getRoot(instanceId);
    }   
}


export function evalRenderer(rendererCode) {
    var scope;
    if (typeof frameworkCode === 'string') {
        scope = evalCode(rendererCode);
    } else {
        scope = global || window;
    }
    registerMethods(scope, debuggableScope);
}
