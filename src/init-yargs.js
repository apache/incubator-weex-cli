// set command args

const yargs = require('yargs');


const userinfo = '\nUsage: weex <foo/bar/we_file_or_dir_path>  [options]'
        + '\nUsage: weex init [projectName]';

var argv = yargs
    .usage(userinfo)
    .option('port' , {demand:false})
    .default('port',8081)
    .describe('port', 'http listening port number ,default is 8081')
    .option('wsport' , {demand:false})
    .default('wsport',8082)
    .describe('wsport', 'websocket listening port number ,default is 8082')
    .default('output','no JSBundle output')
    .describe('output', 'to build the js bundle to the specify a path')
    .describe('wsport', 'websocket listening port number ,default is 8082')
    .epilog('Usage:weex <command>\n\nwhere <command> is one of:\n\n       debug               start weex debugger\n       compile             compile we/vue file\n       run                 run your project\n\nweex <command> --help      help on <command>')
    .argv  ;


module.exports = {argv,yargs} ;