'use strict';

var _initYargs = require('./init-yargs');

var path = require('path');
var npmlog = require('npmlog');
var debuggerServer = require('../build/debugger-server');

(function argvProcess() {
    var HTTP_PORT = _initYargs.argv.port;
    var WEBSOCKET_PORT = _initYargs.argv.wsport;
    if (_initYargs.argv.debugger) {
        var port = HTTP_PORT == NO_PORT_SPECIFIED ? debuggerServer.DEBUGGER_SERVER_PORT : HTTP_PORT;
        debuggerServer.startListen(port);
        return;
    }

    if (_initYargs.argv._[0] === "create") {
        npmlog.warn('Sorry, "weex create" is no longer supported, we recommand you try "weex init" instead.');
        return;
    }

    if (_initYargs.argv.version) {
        npmlog.info(VERSION);
        return;
    }

    var isSplitCommandMatched = require('split-command')(require('../package.json'));
    if (isSplitCommandMatched) {
        return;
    }

    require('./weex-preview');
    // new preview(inputPath , outputPath , transformWatch, host , shouldOpenBrowser , displayQR , smallQR ,  transformServerPath)
})();