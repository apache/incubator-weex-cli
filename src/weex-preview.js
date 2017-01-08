const fs = require('fs');
const path = require('path');
const npmlog = require('npmlog');     
const preview = require('weex-previewer');
var yargs = require('yargs');

const DEFAULT_HTTP_PORT  = "8081"
const DEFAULT_WEBSOCKET_PORT = "8082"
const NO_JSBUNDLE_OUTPUT = "no JSBundle output"
const DEFAULT_HOST  = "127.0.0.1"

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
  .default('wsport',DEFAULT_WEBSOCKET_PORT)
  .describe('wsport', 'websocket listening port number ,default is 8082')
  .boolean('np' , {demand:false})
  .alias('np', 'notopen')
  .describe('np', 'do not open preview browser automatic')
  .boolean('f') /* for weex create */
  .alias('f', 'force')
  .describe('f', '[for create sub cmd]force to replace exsisting file(s)')
  .epilog('weex debug -h for Weex debug help information.\n\nfor cmd example & more information please visit https://www.npmjs.com/package/weex-toolkit')
  .argv  ;

const inputPath =  argv._[0];
    
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
