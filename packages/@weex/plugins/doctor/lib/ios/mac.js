"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const xcodeproj_1 = require("./xcodeproj");
exports.XcodeRequiredVersionMajor = 9;
exports.XcodeRequiredVersionMinor = 0;
function xcodeSelectPath() {
    try {
        return child_process_1.spawnSync('/usr/bin/xcode-select', ['--print-path']).stdout.trim();
    }
    catch (e) {
        return '';
    }
}
exports.xcodeSelectPath = xcodeSelectPath;
function isXcodeInstalled() {
    return !!xcodeSelectPath();
}
exports.isXcodeInstalled = isXcodeInstalled;
class Xcode {
    constructor() {
        this.getXcodeSelectPath();
    }
    getXcodeSelectPath() {
        try {
            this.xcodeSelectPath = child_process_1.spawnSync('/usr/bin/xcode-select', ['--print-path']).stdout.toString().trim();
        }
        catch (e) {
            throw e;
        }
    }
    get isInstalled() {
        if (!this.xcodeSelectPath) {
            return false;
        }
        return true;
    }
    get versionText() {
        return xcodeproj_1.xcodeProjectInterpreter.versionText;
    }
    get majorVersion() {
        return xcodeproj_1.xcodeProjectInterpreter.majorVersion;
    }
    get minorVersion() {
        return xcodeproj_1.xcodeProjectInterpreter.minorVersion;
    }
    get isVersionSatisfactory() {
        if (!xcodeproj_1.xcodeProjectInterpreter.isInstalled) {
            return false;
        }
        else if (this.majorVersion > exports.XcodeRequiredVersionMajor) {
            return true;
        }
        else if (this.majorVersion === exports.XcodeRequiredVersionMajor) {
            return this.minorVersion >= exports.XcodeRequiredVersionMinor;
        }
        return false;
    }
    get isInstalledAndMeetsVersionCheck() {
        return this.isInstalled && this.isVersionSatisfactory;
    }
    // Has the EULA been signed?
    get eulaSigned() {
        try {
            const result = child_process_1.spawnSync('/usr/bin/xcrun', ['clang', '-v']);
            if (result.stdout && result.stdout.includes('license')) {
                return false;
            }
            else if (result.stderr && result.stderr.includes('license')) {
                return false;
            }
            else {
                return true;
            }
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    /**
     * if additional components need to be installed in
     */
    get isSimctlInstalled() {
        try {
            const result = child_process_1.spawnSync('/usr/bin/xcrun', ['simctl', 'list']);
            return !result.stderr.toString().trim() || result.stderr.toString().trim() === '';
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
}
exports.Xcode = Xcode;
exports.xcode = new Xcode();
class IMobileDevice {
    get isInstalled() {
        try {
            const result = child_process_1.spawnSync('idevice_id', ['-h']);
            if (result.status === 0) {
                return true;
            }
        }
        catch (e) {
            return false;
        }
        return false;
    }
    get isWorking() {
        if (!this.isInstalled) {
            return false;
        }
        try {
            const result = child_process_1.spawnSync('idevice_id', ['-l']);
            if (result.status === 0 || !result.stdout.toString().length) {
                return true;
            }
        }
        catch (e) {
            return false;
        }
        try {
            return child_process_1.spawnSync('idevicename').status === 0;
        }
        catch (e) {
            return false;
        }
    }
}
exports.IMobileDevice = IMobileDevice;
exports.iMobileDevice = new IMobileDevice();
//# sourceMappingURL=mac.js.map