import uuid from 'uuid';
import WebsocketClient from './libs/client';
import WebscoketLogger from './libs/logger';
import {init, logger} from './libs/debugger';
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

function typof(v) {
  var s = Object.prototype.toString.call(v)
  return s.substring(8, s.length - 1)
}

function generateLogArgs(args, expand) {
    return args.map(function generateLogArg(arg) {
        var type = typof(arg);
        var lcType = type.toLowerCase();
        var html;
        switch (lcType) {
            case 'undefined':
            case 'null':
                html = `<span class="arg ${lcType}_arg">${lcType}</span>`;
                break;
            case 'number':
            case 'boolean':
                html = `<span class="arg ${lcType}_arg">${arg.toString()}</span>`;
                break;
            case 'string':
                var originArg;
                if (arg.length > 100) {
                    originArg = arg;
                    arg = arg.substr(0, 50) + '...' + arg.substr(arg.length - 50)
                    html = `<a class="arg ${lcType}_arg"
                                title="${originArg.replace(/"/g, '&quot;')}" onclick="alert(this.title)">
                                <span class="string_quote">"</span>${arg}<span class="string_quote">"</span>
                            </a>`;
                } else {
                    html = `<span class="arg ${lcType}_arg">"${arg}"</span>`;
                }
                break;
            case 'array':
                if (!!expand) {
                    html = `
                        <span class="arg l_square_bracket">[</span>
                        ${generateLogArgs(arg, true)}
                        <span class="arg r_square_bracket">]</span>
                    `;
                    break;
                } else {
                    html = `<a class="arg ${lcType}_arg"
                                title="${JSON.stringify(arg).replace(/"/g, '&quot;')}">
                                [object ${type}]
                            </a>`;
                    break;
                }
            case 'object':
            default:
                if (!!expand) {
                    html = '<span class="arg l_brace">{</span>';
                    let html1 = []
                    for (let key in arg) {
                        html1.push(`
                            <span class="arg object_key">"${key}"</span>
                            <span class="key_separator">:</span>
                            ${generateLogArg(arg[key])}
                        `)
                    }
                    html += html1.join('<span class="arg_separator">,</span>');
                    html += '<span class="arg r_brace">}</span>';
                    break;
                } else {
                    html = `<a class="arg ${lcType}_arg"
                                title="${JSON.stringify(arg).replace(/"/g, '&quot;')}">
                                [object ${type}]
                            </a>`;
                    break;
                }
        }
        return html;
    }).join('<span class="arg_separator">,</span>');
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
        var level = $().data("level");
        console.log("set device level to " + level);
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
