"use strict";
// Android SDK layout:
Object.defineProperty(exports, "__esModule", { value: true });
// $ANDROID_HOME/platform-tools/adb
// $ANDROID_HOME/build-tools/19.1.0/aapt, dx, zipalign
// $ANDROID_HOME/build-tools/22.0.1/aapt
// $ANDROID_HOME/build-tools/23.0.2/aapt
// $ANDROID_HOME/build-tools/24.0.0-preview/aapt
// $ANDROID_HOME/build-tools/25.0.2/apksigner
// $ANDROID_HOME/platforms/android-22/android.jar
// $ANDROID_HOME/platforms/android-23/android.jar
// $ANDROID_HOME/platforms/android-N/android.jar
const path = require("path");
const fs = require("fs");
const platform_1 = require("../base/platform");
const kAndroidHome = 'ANDROID_HOME';
const numberedAndroidPlatformRe = new RegExp('^android-([0-9]+)$');
const sdkVersionRe = new RegExp('^ro.build.version.sdk=([0-9]+)$');
// The minimum Android SDK version we support.
const minimumAndroidSdkVersion = 25;
class AndroidSdk {
    constructor() {
        this.init();
    }
    // public locateAndroidSdk() {
    // }
    findAndroidHomeDir() {
        let androidHomeDir;
        if (process.env[`${kAndroidHome}`]) {
            androidHomeDir = process.env[`${kAndroidHome}`];
        }
        else if (platform_1.homeDirPath) {
            if (platform_1.isLinux) {
                androidHomeDir = path.join(platform_1.homeDirPath, 'Android', 'Sdk');
            }
            else if (platform_1.isMacOS) {
                androidHomeDir = path.join(platform_1.homeDirPath, 'Library', 'Android', 'sdk');
            }
            else if (platform_1.isWindows) {
                androidHomeDir = path.join(platform_1.homeDirPath, 'AppData', 'Local', 'Android', 'sdk');
            }
        }
        if (androidHomeDir) {
            if (this.validSdkDirectory(androidHomeDir)) {
                return androidHomeDir;
            }
            if (this.validSdkDirectory(path.join(androidHomeDir, 'sdk'))) {
                return path.join(androidHomeDir, 'sdk');
            }
        }
    }
    validSdkDirectory(dir) {
        const dirPath = path.join(dir, 'platform-tools');
        if (dirPath) {
            return fs.statSync(dirPath).isDirectory();
        }
        return false;
    }
    init() {
        if (!this.directory) {
            return;
        }
        let platforms = []; // android-23 android-25 android-26 android-27...
        const platformsDir = path.join(this.directory, 'platforms');
        let buildTools = []; // 23.0.1 25.0.3 26.0.0 26.0.2 27.0.3...
        const buildToolsDir = path.join(this.directory, 'build-tools');
        if (fs.existsSync(platformsDir)) {
            platforms = fs.readdirSync(platformsDir);
        }
        if (fs.existsSync(buildToolsDir)) {
            buildTools = fs.readdirSync(buildToolsDir);
        }
    }
}
exports.AndroidSdk = AndroidSdk;
//# sourceMappingURL=android-sdk.js.map