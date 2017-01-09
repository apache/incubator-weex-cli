const fs = require('fs');
const path = require('path');
const npmlog = require('npmlog');     
const preview = require('weex-previewer');

import {argv,yargs} from "./init-yargs";



const inputPath =  argv._[0];
    
let transformServerPath = argv.s
let badWePath =  !!( !inputPath ||   (inputPath.length < 2)  ) //we path can be we file or dir    
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
var shouldOpenBrowser =    argv.np ? false: true
var outputPath = argv.o  // js bundle file path  or  transform output dir path
if ( typeof outputPath  != "string"){
    yargs.showHelp();    
    npmlog.info("must specify output path ");
    process.exit(1); 
}
preview(argv);
