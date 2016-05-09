import uuid from 'uuid';
import WebsocketClient from './libs/client';
import WebscoketLogger from './libs/logger';
import {init, setLogLevel, logger} from './libs/debugger';
import qrcode from './libs/qrcode';

const ENDPOINT = 'framework';
const ID = location.hash.replace('#', '') || uuid.v1();
const hasFrameworkCode = !!window.createInstance;
init(ENDPOINT, ID, hasFrameworkCode);

function generateNativeQRCode() {
    var host = `${location.protocol}//${location.hostname}${location.port ? ':' + location.port : ''}`;
    var rendererUrl = WebsocketClient.getServerUrl('renderer', ID);
    var loggerUrl = WebscoketLogger.getServerUrl('renderer', ID);
    var qrUrl = `http://weex-remote-debugger?_wx_debug=${encodeURIComponent(rendererUrl)}`

    var $slogan = document.querySelector('#slogan');
    $slogan.style.display = 'flex';

    var $qrcode = document.querySelector('#qrcode');
    var el = qrcode(qrUrl);
    $qrcode.innerHTML = '';
    $qrcode.appendChild(el);
}

function hideNativeQRCode() {
    var $slogan = document.querySelector('#slogan');
    $slogan.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    location.hash = ID;

    logger.on(function(event) {
        var {id, endpoint, message} = event;
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

    $("#clear").on('click', function() {
        $("#logger").html("");
        return false;
    });
    $("#level li a").on('click', function(e) {
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

    $("#device-level label").on('click', function(e) {
        var level = $(this).data("level");
        console.log("set device level to " + level);
        setLogLevel(level);
        $("#device-level label").removeClass("active");
        $(this).addClass("active").addClass("level-" + level);
    });
    $("#debug-js label").on('click', function(e) {
        var checked = $("#debug-js input")[0].checked;
        if (!checked) {
            $("#debug-js label").removeClass("active");
        } else {
            $("#debug-js label").addClass("active");
        }
    });
});
