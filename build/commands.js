'use strict';

/**
 * Created by exolution on 16/6/29.
 */

var fork = require('child_process').fork;
//获取package.json中对于外部commands的定义定义规则为
//{"commandName":"npm库名.可执行文件名"}
//外部库导出的形式也必须是{"可执行文件名":"可执行文件绝对路径"}
var commands = require('../package.json').commands;
var commandMapper = {};
for (var name in commands) {
    //分离npm库名和可执行文件名
    var splits = commands[name].split('.');
    //拿到可执行文件的绝对路径
    commandMapper[name] = require(splits[0])[splits[1]];
}
exports.exec = function (commandName, argv) {
    if (commandMapper[commandName]) {
        var childProcess = fork(commandMapper[commandName], argv);
        childProcess.on('exit', function () {
            process.exit();
        });
        return true;
    } else {
        return false;
    }
};