"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const platform_1 = require("./platform");
const child_process_1 = require("child_process");
const fs = require("fs");
function runAsync(command, args) {
    return new Promise((resolve, reject) => {
        let result;
        try {
            result = child_process_1.spawnSync(command, args);
            resolve(result);
        }
        catch (e) {
            reject(`Exit code ${result.status} from: ${command}:\n${result}`);
        }
    });
}
exports.runAsync = runAsync;
function cleanInput(s) {
    if (/[^A-Za-z0-9_\/:=-]/.test(s)) {
        s = "'" + s.replace(/'/g, "'\\''") + "'";
        s = s
            .replace(/^(?:'')+/g, '') // unduplicate single-quote at the beginning
            .replace(/\\'''/g, "\\'"); // remove non-escaped single-quote if there are enclosed between 2 escaped
    }
    return s;
}
function commandExistsWindowsSync(commandName, cleanedCommandName, callback) {
    try {
        const stdout = child_process_1.execSync('where ' + cleanedCommandName, { stdio: [] });
        return !!stdout;
    }
    catch (error) {
        return false;
    }
}
function fileNotExistsSync(commandName) {
    try {
        fs.accessSync(commandName, fs.constants.F_OK);
        return false;
    }
    catch (e) {
        return true;
    }
}
function localExecutableSync(commandName) {
    try {
        fs.accessSync(commandName, fs.constants.F_OK | fs.constants.X_OK);
        return false;
    }
    catch (e) {
        return true;
    }
}
function commandExistsUnixSync(commandName, cleanedCommandName, callback) {
    if (fileNotExistsSync(commandName)) {
        try {
            const stdout = child_process_1.execSync('command -v ' + cleanedCommandName + ' 2>/dev/null' + ' && { echo >&1 ' + cleanedCommandName + '; exit 0; }');
            return !!stdout;
        }
        catch (error) {
            return false;
        }
    }
    return localExecutableSync(commandName);
}
function commandExistsSync(commandName) {
    const cleanedCommandName = cleanInput(commandName);
    if (platform_1.isWindows) {
        return commandExistsWindowsSync(commandName, cleanedCommandName);
    }
    else {
        return commandExistsUnixSync(commandName, cleanedCommandName);
    }
}
exports.commandExistsSync = commandExistsSync;
function which(execName, args) {
    const spawnArgs = [execName, ...args];
    const result = child_process_1.spawnSync('which', spawnArgs);
    if (result.status !== 0) {
        return [];
    }
    const lines = result.stdout.toString().trim().split('\n');
    return lines;
}
exports.which = which;
//# sourceMappingURL=process.js.map