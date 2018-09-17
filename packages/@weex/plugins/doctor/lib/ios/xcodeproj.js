"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const platform_1 = require("../base/platform");
const fs_1 = require("fs");
const child_process_1 = require("child_process");
// Interpreter of Xcode projects.
class XcodeProjectInterpreter {
    constructor() {
        this.executable = '/usr/bin/xcodebuild';
        this.versionRegex = /Xcode ([0-9.]+)/;
        this.updateVersion();
    }
    updateVersion() {
        if (!platform_1.isMacOS || !fs_1.existsSync(this.executable)) {
            return;
        }
        try {
            const result = child_process_1.spawnSync(this.executable, ['-version']);
            this.versionText = result.stdout.toString().trim().replace('\n', ', ');
            const match = this.versionText.match(this.versionRegex);
            if (match === null) {
                return;
            }
            const version = match[1];
            const components = version.split('.');
            this.majorVersion = Number(components[0]);
            this.minorVersion = components.length === 1 ? 0 : Number(components[1]);
        }
        catch (e) {
            console.error(e);
        }
    }
    get isInstalled() {
        if (this.majorVersion === undefined) {
            this.updateVersion();
        }
        return this.majorVersion !== undefined;
    }
}
exports.XcodeProjectInterpreter = XcodeProjectInterpreter;
exports.xcodeProjectInterpreter = new XcodeProjectInterpreter();
//# sourceMappingURL=xcodeproj.js.map