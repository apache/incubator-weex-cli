const fs = require('fs'),
    fse = require('fs-extra'),
    path = require('path'),
    opener = require('opener'),
    npmlog = require('npmlog'),     
    httpServer = require('http-server'),
    wsServer = require('ws').Server,
    watch =  require('node-watch'),
    os  = require('os'),
    _   = require("underscore"),
    webpack = require('webpack'),
    webpackLoader = require('weex-loader'),
    qrcode = require('qrcode-terminal-alpha'),          
    nwUtils =  require('../build/nw-utils'),      
    fsUtils = require('../build/fs-utils'),
    displayUtils = require('../build/display-utils'),            
    debuggerServer =  require('../build/debugger-server'),
    weFileCreate = require('../build/create');

var yargs = require('yargs')
var argv = yargs
    .usage('\nUsage: weex foo/bar/we_file_or_dir_path  [options]'
           + '\nUsage: weex debug [options] [we_file|bundles_dir]'   
           + '\nUsage: weex init'           
              )
        .boolean('qr')
        .describe('qr', 'display QR code for PlaygroundApp')
         .boolean('smallqr')
        .describe('smallqr', 'display small-scale version of QR code for PlaygroundApp,try it if you use default font in CLI')    
        .option('h' , {demand:false})
        .default('h',DEFAULT_HOST)
        .alias('h', 'host')
        .option('o' , {demand:false})
        .alias('o', 'output')
        .default('o',NO_JSBUNDLE_OUTPUT)
        .describe('o', 'transform weex we file to JS Bundle, output path must specified (single JS bundle file or dir)\n[for create sub cmd]it specified we file output path')
        .option('watch' , {demand:false})
        .describe('watch', 'using with -o , watch input path , auto run transform if change happen')
        .option('s' , {demand:false, alias: 'server', type: 'string'})
        .describe('s', 'start a http file server, weex .we file will be transforme to JS bundle on the server , specify local root path using the option')
        .option('port' , {demand:false})
        .default('port',8081)
        .describe('port', 'http listening port number ,default is 8081')
        .option('wsport' , {demand:false})
        .default('wsport',NO_PORT_SPECIFIED)
        .describe('wsport', 'websocket listening port number ,default is 8082')
        .boolean('np' , {demand:false})
        .alias('np', 'notopen')
        .describe('np', 'do not open preview browser automatic')
        .boolean('f') /* for weex create */
        .alias('f', 'force')
        .describe('f', '[for create sub cmd]force to replace exsisting file(s)')
        .epilog('weex debug -h for Weex debug help information.\n\nfor cmd example & more information please visit https://www.npmjs.com/package/weex-toolkit')
        .argv  ;


(function argvProcess(){
    console.log(argv);
    HTTP_PORT = argv.port;
    WEBSOCKET_PORT = argv.wsport;
    if (argv.debugger){
        let port = (HTTP_PORT == NO_PORT_SPECIFIED) ? debuggerServer.DEBUGGER_SERVER_PORT : HTTP_PORT ;     
        debuggerServer.startListen(port)
        return
    }
    
    if (argv._[0] === 'init') {
      
        generator.generate(argv._[1]);
        return;
    }

    if (argv._[0] === "create"){
        npmlog.warn('\nSorry, "weex create" is no longer supported, we recommand you please try "weex init" instead.')
        return
    }
    
    if (argv.version){
        npmlog.info(VERSION)
        return
    }


    var isSplitCommandMatched = require('split-command')(require('../package.json'))
    if (isSplitCommandMatched){
        return
    }

    var inputPath =  argv._[0];
    
    var transformServerPath = argv.s
    var badWePath =  !!( !inputPath ||   (inputPath.length < 2)  ) //we path can be we file or dir    
    try {
        fs.accessSync(inputPath, fs.F_OK);
    } catch (e) {
        if (!transformServerPath && !!inputPath) { npmlog.error(`\n ${inputPath} not accessable`)}
        badWePath = true
    }        

    if ( badWePath  &&  !transformServerPath ){
        yargs.showHelp()
        process.exit(1)
    }

    if (transformServerPath){
        var absPath = path.resolve(transformServerPath)
        try{
            var res = fs.accessSync(transformServerPath)
        }catch(e){
            yargs.showHelp()            
            npmlog.info(`path ${absPath} not accessible`)
            process.exit(1)
        }
    }

    var host = argv.h  
    var shouldOpenBrowser =    argv.np ? false: true
    var displayQR =  argv.qr  //  ? true : false
    var smallQR = argv.smallqr 
    var outputPath = argv.o  // js bundle file path  or  transform output dir path
    if ( typeof outputPath  != "string"){
        yargs.showHelp()    
        npmlog.info("must specify output path ")
        process.exit(1)    
    }
    var transformWatch =  argv.watch
    preview(argv);
    // new preview(inputPath , outputPath , transformWatch, host , shouldOpenBrowser , displayQR , smallQR ,  transformServerPath)

})()
