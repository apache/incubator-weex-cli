"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("../process/process");
const path = require("path");
const fs = require("fs");
const version_1 = require("../base/version");
const platform_1 = require("../platform/platform");
exports.noCocoaPodsConsequence = `
  CocoaPods is used to retrieve the iOS platform side's plugin code.
  Without resolving iOS dependencies with CocoaPods, plugins will not work on iOS.`;
exports.cocoaPodsInstallInstructions = `
  brew install cocoapods
  pod setup`;
exports.cocoaPodsUpgradeInstructions = `
  brew upgrade cocoapods
  pod setup`;
var CocoaPodsStatus;
(function (CocoaPodsStatus) {
    // iOS plugins will not work, installation required.
    CocoaPodsStatus[CocoaPodsStatus["notInstalled"] = 0] = "notInstalled";
    // iOS plugins will not work, upgrade required.
    CocoaPodsStatus[CocoaPodsStatus["belowMinimumVersion"] = 1] = "belowMinimumVersion";
    // iOS plugins may not work in certain situations (Swift, static libraries),
    // upgrade recommended.
    CocoaPodsStatus[CocoaPodsStatus["belowRecommendedVersion"] = 2] = "belowRecommendedVersion";
    // Everything should be fine.
    CocoaPodsStatus[CocoaPodsStatus["recommended"] = 3] = "recommended";
})(CocoaPodsStatus = exports.CocoaPodsStatus || (exports.CocoaPodsStatus = {}));
class CocoaPods {
    constructor() {
        this.cocoaPodsMinimumVersion = '1.0.0';
        this.cocoaPodsRecommendedVersion = '1.5.0';
        process_1.runAsync('pod', ['--version'])
            .then((result) => {
            if (result.status === 0) {
                this.cocoaPodsVersionText = result.stdout.toString().trim();
            }
        })
            .catch(e => {
            console.error(e);
        });
    }
    get evaluateCocoaPodsInstallation() {
        if (!this.cocoaPodsVersionText) {
            return CocoaPodsStatus.notInstalled;
        }
        try {
            const version = version_1.versionParse(this.cocoaPodsVersionText);
            if (!version_1.compareVersion(version, version_1.versionParse(this.cocoaPodsMinimumVersion))) {
                return CocoaPodsStatus.belowMinimumVersion;
            }
            else if (!version_1.compareVersion(version, version_1.versionParse(this.cocoaPodsRecommendedVersion))) {
                return CocoaPodsStatus.belowRecommendedVersion;
            }
            else {
                return CocoaPodsStatus.recommended;
            }
        }
        catch (e) {
            return CocoaPodsStatus.notInstalled;
        }
    }
    // where the costly pods' specs are cloned.
    get isCocoaPodsInitialized() {
        const cocoaPath = path.join(platform_1.homedir, '.cocoapods', 'repos', 'master');
        if (fs.existsSync(cocoaPath)) {
            return fs.statSync(cocoaPath).isDirectory();
        }
        return false;
    }
}
exports.CocoaPods = CocoaPods;
//# sourceMappingURL=cocoapods.js.map