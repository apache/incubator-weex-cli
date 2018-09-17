"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMacOS = process.platform === 'darwin';
exports.isWindows = process.platform === 'win32';
exports.isLinux = process.platform === 'linux';
exports.homeDirPath = process.env.HOME || process.env.USERPROFILE;
//# sourceMappingURL=platform.js.map