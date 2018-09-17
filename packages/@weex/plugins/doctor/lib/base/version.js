"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionPattern = /^(\d+)(\.(\d+)(\.(\d+))?)?/;
function versionParse(text) {
    const match = text.match(exports.versionPattern);
    if (!match) {
        return null;
    }
    const result = {
        major: Number(match[1]),
        minor: Number(match[3]),
        patch: Number(match[5]),
    };
    return result;
}
exports.versionParse = versionParse;
/**
 * check non-negative version
 * @param version
 */
function versionNonNegative(version) {
    if (!version) {
        return false;
    }
    if (version.major < 0 || version.minor < 0 || version.patch < 0) {
        return false;
    }
    return true;
}
exports.versionNonNegative = versionNonNegative;
function compareVersion(version, otherVersion) {
    if (!version || !otherVersion) {
        return false;
    }
    if (version.major < otherVersion.major) {
        return false;
    }
    else if (version.major >= otherVersion.major) {
        return true;
    }
    else if (version.minor < otherVersion.minor) {
        return false;
    }
    else if (version.minor >= otherVersion.minor) {
        return true;
    }
    else if (version.patch < otherVersion.patch) {
        return false;
    }
    else if (version.patch >= otherVersion.patch) {
        return true;
    }
}
exports.compareVersion = compareVersion;
//# sourceMappingURL=version.js.map