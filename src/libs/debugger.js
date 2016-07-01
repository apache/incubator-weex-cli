import WebsocketClient from './client';
import qrcode from './qrcode';
import {setLoggerHeight , vueInstance} from '../debugger-page';

function debuggableDecorator(target, name, descriptor) {
    descriptor = descriptor
    var fn = descriptor.value;

    descriptor.value = function() {
        wsc.send(name, [...arguments]);
    };

    wsc.on(name, function(args) {
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
export function init(endpoint, id, frameworkCode, rendererCode) {
    wsc = new WebsocketClient(endpoint, id);

    var scope;
    if (typeof global !== 'undefined') {
        scope = global;
    } else if (typeof window !== 'undefined') {
        scope = window;
    } else  {
        scope = {};
    }
    registerMethods(scope, debuggableScope);
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
        if (!hideNativeQRCode.hidden){
            hideNativeQRCode();
        }
        printLog(flag, message);
    },
    __connect (scopeFunction, message) {
        if (message === 'framework') {
            generateNativeQRCode();
        } else if (message === 'renderer') {
            hideNativeQRCode();
        }
    },
    setEnvironment (scopeFunction, env) {
        global.WXEnvironment = env;
        var deviceLevel = env.logLevel;
        vueInstance.deviceLevel =  deviceLevel;
        vueInstance.updateDeviceLevel();        
    }
}

function printLog(flag, message) {
    var div, html;
    if (flag == null) {
        flag = 'info';
    }
    vueInstance.logs.push({content:message,flag:flag})
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

//TODO: not a suitable place , need refactoring
export function setLogLevel(logLevel) {
    wsc.send('setLogLevel', [logLevel]);
}

function generateNativeQRCode() {
    var host = `${location.protocol}//${location.hostname}${location.port ? ':' + location.port : ''}`;
    const ID = location.hash.replace('#', '') || uuid.v1();
    var rendererUrl = WebsocketClient.getServerUrl('renderer', ID);
    var qrUrl = `http://weex-remote-debugger?_wx_debug=${encodeURIComponent(rendererUrl)}`;

    var $slogan = document.querySelector('#slogan');
    $slogan.style.display = 'flex';

    var $qrcode = document.querySelector('#qrcode');
    var el = qrcode(qrUrl);
    $qrcode.innerHTML = '';
    $qrcode.appendChild(el);
}

hideNativeQRCode.hidden = false
function hideNativeQRCode() {
    $('#slogan').hide()
    $("#logs").show()
    setLoggerHeight()
    $( window ).resize(function() {
        setLoggerHeight()        
    })

    $("#page-title").css("left",`${($(window).width() - 350 )/2}px`)

    setTimeout(()=>{
        $("#page-title").css("transition","all 2s")            
        $("#page-title").css("left","25px")            
        setTimeout(()=>{
            $("#page-title").css("left","105px")                        
            $("#page-title").addClass("vertical")
            $("#logs").css("top","20px")
        },1000)
    },1000)
    
    hideNativeQRCode.hidden = true
}

window._hideNativeQRCode = hideNativeQRCode //just for debug debugger
