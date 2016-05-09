'use strict';

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
        var level = $(this).data("level");
        console.log("set device level to " + level);
        (0, _debugger.setLogLevel)(level);
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