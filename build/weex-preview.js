'use strict';

var _initYargs = require('./init-yargs');

var fs = require('fs');
var path = require('path');
var npmlog = require('npmlog');
var preview = require('weex-previewer');

var inputPath = _initYargs.argv._[0];

var transformServerPath = _initYargs.argv.s;
var badWePath = !!(!inputPath || inputPath.length < 2); //we path can be we file or dir    
try {
    fs.accessSync(inputPath, fs.F_OK);
} catch (e) {
    if (!transformServerPath && !!inputPath) {
        npmlog.error('\n ' + inputPath + ' not accessable');
    }
    badWePath = true;
}

if (badWePath && !transformServerPath) {
    _initYargs.yargs.showHelp();
    process.exit(1);
}

if (transformServerPath) {
    var absPath = path.resolve(transformServerPath);
    try {
        var res = fs.accessSync(transformServerPath);
    } catch (e) {
        _initYargs.yargs.showHelp();
        npmlog.info('path ' + absPath + ' not accessible');
        process.exit(1);
    }
}

var host = _initYargs.argv.h;
var shouldOpenBrowser = _initYargs.argv.np ? false : true;
var displayQR = _initYargs.argv.qr; //  ? true : false
var smallQR = _initYargs.argv.smallqr;
var outputPath = _initYargs.argv.o; // js bundle file path  or  transform output dir path
if (typeof outputPath != "string") {
    _initYargs.yargs.showHelp();
    npmlog.info("must specify output path ");
    process.exit(1);
}
var transformWatch = _initYargs.argv.watch;
preview(_initYargs.argv);