"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require('os');
const platform = os.platform();
/**
 * For check platform and provide some platform value
 */
exports.isWindows = /^win/.test(platform);
exports.isMacOS = /^darwin/.test(platform);
exports.isLinux = /^linux/.test(platform);
exports.homedir = os.homedir();
//# sourceMappingURL=PLATFORM.js.map