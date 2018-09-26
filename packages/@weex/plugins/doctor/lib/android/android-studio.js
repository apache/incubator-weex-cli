"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const platform_1 = require("@weex-cli/utils/lib/platform/platform");
const path = require("path");
const fs = require("fs");
const ios_workflow_1 = require("../ios/ios-workflow");
const plist_utils_1 = require("@weex-cli/utils/lib/ios/plist-utils");
const version_1 = require("@weex-cli/utils/lib/base/version");
const process_1 = require("../base/process");
// Android Studio layout:
// Linux/Windows:
// $HOME/.AndroidStudioX.Y/system/.home
// macOS:
// /Applications/Android Studio.app/Contents/
// $HOME/Applications/Android Studio.app/Contents/
const _dotHomeStudioVersionMatcher = new RegExp('^\.AndroidStudio([^\d]*)([\d.]+)');
class AndroidStudio {
    constructor() {
        this.latestValid();
    }
    // Locates the newest, valid version of Android Studio.
    latestValid() {
        const studios = this.allInstalled();
    }
    allInstalled() {
        platform_1.isMacOS ? this.allMacOS() : this.allLinuxOrWindows();
    }
    allMacOS() {
        let directories = [];
        this.checkForStudio('/Applications').forEach(name => {
            directories.push(`/Applications/${name}`);
        });
        this.checkForStudio(path.join(platform_1.homedir, 'Applications')).forEach(name => {
            directories.push(path.join(platform_1.homedir, 'Applications', name));
        });
        return directories.map(path => this.fromMacOSBundle(path));
    }
    checkForStudio(path) {
        if (!fs.existsSync(path)) {
            return;
        }
        const candidatePaths = [];
        try {
            const directories = fs.readdirSync(path);
            for (let name of directories) {
                // An exact match, or something like 'Android Studio 3.0 Preview.app'.
                if (name.startsWith('Android Studio') && name.endsWith('.app')) {
                    candidatePaths.push(name);
                }
            }
        }
        catch (e) {
            console.error(e);
        }
        return candidatePaths;
    }
    fromMacOSBundle(bundlePath) {
        const studioPath = path.join(bundlePath, 'Contents');
        const plistFile = path.join(studioPath, 'Info.plist');
        const versionString = ios_workflow_1.iosWorkflow.getPlistValueFromFile(plistFile, plist_utils_1.kCFBundleShortVersionStringKey);
        let version;
        if (versionString) {
            version = version_1.versionParse(versionString);
        }
        return new AndroidStudioValid(studioPath, { version: version });
    }
    fromHomeDot(homeDotDir) {
        const versionMatch = path.basename(platform_1.homedir).match(_dotHomeStudioVersionMatcher)[1];
        if (versionMatch.length !== 3) {
            return null;
        }
        const version = version_1.versionParse(versionMatch[2]);
        if (!version) {
            return null;
        }
        let installPath;
        if (fs.existsSync(path.join(homeDotDir, 'system', '.home'))) {
            installPath = path.join(homeDotDir, 'system', '.home');
        }
        if (installPath) {
            return new AndroidStudioValid(installPath, { version: version });
        }
        return null;
    }
    allLinuxOrWindows() {
        let studios = [];
        function hasStudioAt(path, newerThan) {
            return studios.every(studio => {
                if (studio.directory !== path) {
                    return false;
                }
                if (newerThan) {
                    return version_1.compareVersion(studio.version, newerThan);
                }
                return true;
            });
        }
        // Read all $HOME/.AndroidStudio*/system/.home files. There may be several
        // pointing to the same installation, so we grab only the latest one.
        if (fs.existsSync(platform_1.homedir)) {
            for (let entity of fs.readdirSync(platform_1.homedir)) {
                const homeDotDir = path.join(process.env['HOME'], entity);
                if (fs.statSync(homeDotDir).isDirectory() && entity.startsWith('.AndroidStudio')) {
                    const studio = this.fromHomeDot(homeDotDir);
                    if (studio && !hasStudioAt(studio.directory, studio.version)) {
                        studios = studios.filter(other => other.directory !== studio.directory);
                        studios.push(studio);
                    }
                }
            }
        }
        function checkWellKnownPath(path) {
            if (fs.existsSync(path) && !hasStudioAt(path)) {
                studios.push(new AndroidStudioValid(path));
            }
        }
        if (platform_1.isLinux) {
            // Add /opt/android-studio and $HOME/android-studio, if they exist.
            checkWellKnownPath('/opt/android-studio');
            checkWellKnownPath(`${platform_1.homedir}/android-studio`);
        }
        return studios;
    }
}
exports.AndroidStudio = AndroidStudio;
exports.androidStudio = new AndroidStudio();
class AndroidStudioValid {
    constructor(directory, option) {
        this.directory = directory;
        this.option = option;
        this.isValid = true;
        this.validationMessages = [];
        this.directory = directory;
        this.configured = this.option.configured;
        this.version = this.option.version;
        this.init();
    }
    init() {
        if (this.configured) {
            this.validationMessages.push(`android-studio-dir = ${this.configured}`);
        }
        if (!fs.existsSync(this.directory)) {
            this.validationMessages.push(`Android Studio not found at ${this.directory}`);
            return;
        }
        this.javaPath = platform_1.isMacOS
            ? path.join(this.directory, 'jre', 'jdk', 'Contents', 'Home')
            : path.join(this.directory, 'jre');
        const javaExecutable = path.join(this.javaPath, 'bin', 'java');
        if (!process_1.canRunSync(javaExecutable)) {
            this.validationMessages.push(`Unable to find bundled Java version.`);
        }
        else {
            const result = process_1.runSync(javaExecutable, ['-version']);
            if (result && result.status === 0) {
                const versionLines = result.stderr.toString().split('\n');
                const javaVersion = versionLines.length >= 2 ? versionLines[1] : versionLines[0];
                this.validationMessages.push(`Java version ${javaVersion}`);
                this.isValid = true;
            }
            else {
                this.validationMessages.push('Unable to determine bundled Java version.');
            }
        }
    }
}
exports.AndroidStudioValid = AndroidStudioValid;
//# sourceMappingURL=android-studio.js.map