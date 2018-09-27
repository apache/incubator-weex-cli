"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("../process/process");
const error_list_1 = require("../error/error-list");
class IosEnv {
    isInstalledXcode(isThrowError = true) {
        const result = process_1.runAndGetOutput(`/usr/bin/xcode-select --print-path`);
        if (result) {
            return !!result;
        }
        if (isThrowError) {
            throw error_list_1.IOS_XCODE_NOT_INSTALLED;
        }
        return false;
    }
    getXcodeVersion() {
        const result = process_1.runAndGetOutput(`xcodebuild -version`);
        const lines = result.split('\n');
        let version = null;
        lines.some(line => {
            const match = line.match(/^Xcode\s+(\d.\d.\d)/);
            if (match && match[1]) {
                version = match[1];
                return true;
            }
        });
        return version;
    }
}
exports.default = IosEnv;
//# sourceMappingURL=ios-env.js.map