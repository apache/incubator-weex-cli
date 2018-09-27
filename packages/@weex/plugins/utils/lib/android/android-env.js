"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const fs = require('fs');
const PLATFORM = require("../PLATFORM/PLATFORM");
const PROCESS = require("../process/process");
const error_list_1 = require("../error/error-list");
const kAndroidHome = 'ANDROID_HOME';
class AndroidEnv {
    constructor(options = {}) {
        this.ANDROID_SDK_PATH = null;
        this.ANDROID_ADB_PATH = null;
        this.ANDROID_EMULATOR_PATH = null;
        this.options = options;
    }
    init() {
        const options = this.options;
        this.ANDROID_SDK_PATH = options.sdkPath || this.getSdkPath();
        this.ANDROID_ADB_PATH = options.adbPath || this.getAdbPath();
        this.ANDROID_EMULATOR_PATH = this.getEmulatorPath();
    }
    getSdkPath(isThrowError = true) {
        let sdkPath;
        if (process.env[kAndroidHome]) {
            sdkPath = process.env[kAndroidHome];
        }
        else {
            if (PLATFORM.isLinux) {
                sdkPath = path.join(PLATFORM.homedir, 'Android', 'Sdk');
            }
            if (PLATFORM.isMacOS) {
                sdkPath = path.join(PLATFORM.homedir, 'Library', 'Android', 'sdk');
            }
            if (PLATFORM.isWindows) {
                sdkPath = path.join(PLATFORM.homedir, 'AppData', 'Local', 'Android', 'sdk');
            }
        }
        if (fs.existsSync(path.join(sdkPath, 'platform-tools'))) {
            return sdkPath;
        }
        if (isThrowError) {
            throw error_list_1.ANDROID_SDK_NOT_FIND;
        }
        return null;
    }
    getAdbPath(isThrowError = true) {
        this.ANDROID_SDK_PATH = this.ANDROID_SDK_PATH || this.getSdkPath();
        const defaultAdbPath = path.join(this.ANDROID_SDK_PATH, 'platform-tools', 'adb');
        if (this.ANDROID_SDK_PATH && (fs.existsSync(defaultAdbPath) || fs.existsSync(`${defaultAdbPath}.exe`))) {
            return defaultAdbPath;
        }
        if (PLATFORM.isWindows) {
            const output = PROCESS.runAndGetOutput(`where adb`);
            if (output.indexOf('adb.exe') !== -1) {
                return path.join(output.replace('adb.exe', 'adb').replace(/\n/g, ''));
            }
        }
        if (PLATFORM.isLinux || PLATFORM.isMacOS) {
            const output = PROCESS.runAndGetOutput(`which adb`);
            if (output.indexOf('not found') === -1) {
                return path.join(output.replace(/\n/g, ''));
            }
        }
        if (isThrowError) {
            throw error_list_1.ANDROID_ADB_NOT_FIND;
        }
        return null;
    }
    getEmulatorPath(sdkPath, isThrowError = true) {
        this.ANDROID_SDK_PATH = this.ANDROID_SDK_PATH || this.getSdkPath();
        const emulatorPath = path.join(this.ANDROID_SDK_PATH || sdkPath, 'emulator', PLATFORM.isWindows ? 'emulator.exe' : 'emulator');
        if (fs.existsSync(emulatorPath)) {
            return emulatorPath;
        }
        if (isThrowError) {
            throw error_list_1.ANDROID_EMULATOR_NOT_FIND;
        }
    }
    /**
     * Ndk is not necessary
     */
    getNdkPath(sdkPath, isThrowError = true) {
        console.warn('Ndk is not necessary, please make sure you need it');
        this.ANDROID_SDK_PATH = this.ANDROID_SDK_PATH || this.getSdkPath();
        const ndkPath = path.join(this.ANDROID_SDK_PATH || sdkPath, 'ndk-bundle');
        if (fs.existsSync(ndkPath)) {
            return ndkPath;
        }
        if (isThrowError) {
            throw error_list_1.ANDROID_NDK_NOT_FIND;
        }
    }
}
exports.default = AndroidEnv;
//# sourceMappingURL=android-env.js.map