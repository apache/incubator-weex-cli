'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _client = require('./libs/client');

var _client2 = _interopRequireDefault(_client);

var _logger = require('./libs/logger');

var _logger2 = _interopRequireDefault(_logger);

var _debugger = require('./libs/debugger');

var _qrcode = require('./libs/qrcode');

var _qrcode2 = _interopRequireDefault(_qrcode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ENDPOINT = 'framework';
var ID = location.hash.replace('#', '') || _uuid2.default.v1();
var hasFrameworkCode = !!window.createInstance;
(0, _debugger.init)(ENDPOINT, ID, hasFrameworkCode);

function generateNativeQRCode() {
    var host = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    var rendererUrl = _client2.default.getServerUrl('renderer', ID);
    var loggerUrl = _logger2.default.getServerUrl('renderer', ID);
    var qrUrl = 'http://weex-remote-debugger?_wx_debug=' + encodeURIComponent(rendererUrl);

    var $slogan = document.querySelector('#slogan');
    $slogan.style.display = 'flex';

    var $qrcode = document.querySelector('#qrcode');
    var el = (0, _qrcode2.default)(qrUrl);
    $qrcode.innerHTML = '';
    $qrcode.appendChild(el);
}

function hideNativeQRCode() {
    var $slogan = document.querySelector('#slogan');
    $slogan.style.display = 'none';
}

function typof(v) {
    var s = Object.prototype.toString.call(v);
    return s.substring(8, s.length - 1);
}

function generateLogArgs(args, expand) {
    return args.map(function generateLogArg(arg) {
        var type = typof(arg);
        var lcType = type.toLowerCase();
        var html;
        switch (lcType) {
            case 'undefined':
            case 'null':
                html = '<span class="arg ' + lcType + '_arg">' + lcType + '</span>';
                break;
            case 'number':
            case 'boolean':
                html = '<span class="arg ' + lcType + '_arg">' + arg.toString() + '</span>';
                break;
            case 'string':
                var originArg;
                if (arg.length > 100) {
                    originArg = arg;
                    arg = arg.substr(0, 50) + '...' + arg.substr(arg.length - 50);
                    html = '<a class="arg ' + lcType + '_arg"\n                                title="' + originArg.replace(/"/g, '&quot;') + '" onclick="alert(this.title)">\n                                <span class="string_quote">"</span>' + arg + '<span class="string_quote">"</span>\n                            </a>';
                } else {
                    html = '<span class="arg ' + lcType + '_arg">"' + arg + '"</span>';
                }
                break;
            case 'array':
                if (!!expand) {
                    html = '\n                        <span class="arg l_square_bracket">[</span>\n                        ' + generateLogArgs(arg, true) + '\n                        <span class="arg r_square_bracket">]</span>\n                    ';
                    break;
                } else {
                    html = '<a class="arg ' + lcType + '_arg"\n                                title="' + (0, _stringify2.default)(arg).replace(/"/g, '&quot;') + '">\n                                [object ' + type + ']\n                            </a>';
                    break;
                }
            case 'object':
            default:
                if (!!expand) {
                    html = '<span class="arg l_brace">{</span>';
                    var html1 = [];
                    for (var key in arg) {
                        html1.push('\n                            <span class="arg object_key">"' + key + '"</span>\n                            <span class="key_separator">:</span>\n                            ' + generateLogArg(arg[key]) + '\n                        ');
                    }
                    html += html1.join('<span class="arg_separator">,</span>');
                    html += '<span class="arg r_brace">}</span>';
                    break;
                } else {
                    html = '<a class="arg ' + lcType + '_arg"\n                                title="' + (0, _stringify2.default)(arg).replace(/"/g, '&quot;') + '">\n                                [object ' + type + ']\n                            </a>';
                    break;
                }
        }
        return html;
    }).join('<span class="arg_separator">,</span>');
}

document.addEventListener('DOMContentLoaded', function () {
    location.hash = ID;

    _debugger.logger.on(function (event) {
        var id = event.id;
        var endpoint = event.endpoint;
        var message = event.message;

        if (id === ID && endpoint === 'server') {
            if (message === 'framework connected') {
                generateNativeQRCode();
            } else if (message === 'renderer connected') {
                hideNativeQRCode();
            }
        } else if (id === ID && endpoint === ENDPOINT) {
            //appendLog(message);
        }
    });

    $("#clear").on('click', function () {
        $("#logger").html("");
        return false;
    });
    $("#level li a").on('click', function (e) {
        var level;
        level = $(this).data("level");
        if (level) {
            console.log("set filter to " + level);
            $("#level li").removeClass("active");
            $(this).parent().addClass("active").addClass("level-" + level);
            $("#logger").removeClass("level-error level-warn level-info level-debug level-verbose level-all");
            $("#logger").addClass("level-" + level);
        }
        return false;
    });

    $("#device-level label").on('click', function (e) {
        var level = $().data("level");
        console.log("set device level to " + level);
        $("#device-level label").removeClass("active");
        $(this).addClass("active").addClass("level-" + level);
    });
    $("#debug-js label").on('click', function (e) {
        var checked = $("#debug-js input")[0].checked;
        if (!checked) {
            $("#debug-js label").removeClass("active");
        } else {
            $("#debug-js label").addClass("active");
        }
    });
});