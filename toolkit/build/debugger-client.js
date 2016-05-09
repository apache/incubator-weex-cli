'use strict';

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _client = require('./libs/client');

var _client2 = _interopRequireDefault(_client);

var _debugger = require('./libs/debugger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ENDPOINT = 'framework';
var ID = location.hash.replace('#', '') || _uuid2.default.v1();
var hasFrameworkCode = !!window.createInstance;
(0, _debugger.init)(ENDPOINT, ID, hasFrameworkCode);

document.addEventListener('DOMContentLoaded', function () {
    location.hash = ID;

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