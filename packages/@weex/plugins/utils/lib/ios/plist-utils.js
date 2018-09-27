"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const child_process_1 = require("child_process");
exports.kCFBundleShortVersionStringKey = 'CFBundleShortVersionString';
function getValueFromFile(plistFilePath, key) {
    const executable = '/usr/bin/defaults';
    if (!fs.existsSync(executable)) {
        return null;
    }
    if (!fs.existsSync(plistFilePath)) {
        return null;
    }
    const parsePlistPath = path.parse(plistFilePath);
    const normalizedPlistPath = path.join(parsePlistPath.dir, parsePlistPath.name);
    try {
        const results = child_process_1.spawnSync(executable, ['read', normalizedPlistPath, key]);
        return results.stdout.toString().trim();
    }
    catch (e) {
        return null;
    }
}
exports.getValueFromFile = getValueFromFile;
//# sourceMappingURL=plist-utils.js.map