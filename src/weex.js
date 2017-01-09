const path = require('path');
const npmlog = require('npmlog');     
const debuggerServer = require('../build/debugger-server');

import {argv,yargs} from "./init-yargs";

(function argvProcess(){
    let HTTP_PORT = argv.port;
    let WEBSOCKET_PORT = argv.wsport;
    if (argv.debugger){
        let port = (HTTP_PORT == NO_PORT_SPECIFIED) ? debuggerServer.DEBUGGER_SERVER_PORT : HTTP_PORT ;     
        debuggerServer.startListen(port)
        return
    }
    
    if (argv._[0] === "create"){
        npmlog.warn('Sorry, "weex create" is no longer supported, we recommand you try "weex init" instead.')
        return;
    }
    
    if (argv.version){
        npmlog.info(VERSION);
        return;
    }

    var isSplitCommandMatched = require('split-command')(require('../package.json'))
    if (isSplitCommandMatched){
        return
    }

    require('./weex-preview');
    // new preview(inputPath , outputPath , transformWatch, host , shouldOpenBrowser , displayQR , smallQR ,  transformServerPath)
})()
