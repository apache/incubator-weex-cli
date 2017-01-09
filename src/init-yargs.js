// set command args

const yargs = require('yargs');

const DEFAULT_HTTP_PORT  = "8081";
const DEFAULT_WEBSOCKET_PORT = "8082";
const NO_JSBUNDLE_OUTPUT = "no JSBundle output";
const DEFAULT_HOST  = "127.0.0.1";


const userinfo = '\nUsage: weex foo/bar/we_file_or_dir_path  [options]'
        + '\nUsage: weex debug [options] [we_file|bundles_dir]'   
        + '\nUsage: weex init';


var argv = yargs
    .usage(userinfo)
    .boolean('qr')
    .describe('qr', 'display QR code for PlaygroundApp')
     .boolean('smallqr')
    .describe('smallqr', 'display small-scale version of QR code for PlaygroundApp,try it if you use default font in CLI')    
    .option('h' , {demand:false})
    .default('h',DEFAULT_HTTP_PORT)
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
    .default('wsport',8082)
    .describe('wsport', 'websocket listening port number ,default is 8082')
    .boolean('np' , {demand:false})
    .alias('np', 'notopen')
    .describe('np', 'do not open preview browser automatic')
    .boolean('f') /* for weex create */
    .alias('f', 'force')
    .describe('f', '[for create sub cmd]force to replace exsisting file(s)')
    .epilog('weex debug -h for Weex debug help information.\n\nfor cmd example & more information please visit https://www.npmjs.com/package/weex-toolkit')
    .argv  ;


module.exports = {argv,yargs} ;