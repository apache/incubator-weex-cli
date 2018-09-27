"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const doctor_1 = require("../doctor");
const mac_1 = require("@weex-cli/utils/lib/ios/mac");
const cocoapods_1 = require("@weex-cli/utils/lib/ios/cocoapods");
const process_1 = require("@weex-cli/utils/lib/process/process");
const child_process_1 = require("child_process");
const version_1 = require("@weex-cli/utils/lib/base/version");
const plist = require("@weex-cli/utils/lib/ios/plist-utils");
const ios_env_1 = require("@weex-cli/utils/lib/ios/ios-env");
class IOSWorkflow {
    get appliesToHostPlatform() {
        return process.platform === 'darwin';
    }
    getPlistValueFromFile(path, key) {
        return plist.getValueFromFile(path, key);
    }
}
exports.IOSWorkflow = IOSWorkflow;
class IOSValidator {
    constructor() {
        this.messages = [];
        this.xcodeStatus = 0 /* missing */;
        this.brewStatus = 0 /* missing */;
        this.cocoaPods = new cocoapods_1.CocoaPods();
        this.xcode = new mac_1.Xcode();
        this.iosEnv = new ios_env_1.default();
        this.title = 'iOS toolchain - develop for iOS devices';
    }
    get hasHomebrew() {
        return !!process_1.which('brew').length;
    }
    get hasIDeviceInstaller() {
        try {
            return child_process_1.spawnSync('ideviceinstaller', ['-h']).status === 0;
        }
        catch (e) {
            return false;
        }
    }
    get hasIosDeploy() {
        try {
            return child_process_1.spawnSync('ios-deploy', ['--version']).status === 0;
        }
        catch (e) {
            return false;
        }
    }
    get iosDeployVersionText() {
        try {
            return child_process_1.spawnSync('ios-deploy', ['--version'])
                .stdout.toString()
                .replace('\n', '');
        }
        catch (e) {
            return '';
        }
    }
    get iosDeployMinimumVersion() {
        return '1.9.2';
    }
    get iosDeployIsInstalledAndMeetsVersionCheck() {
        if (!this.hasIosDeploy) {
            return false;
        }
        const version = version_1.versionParse(this.iosDeployVersionText);
        return version_1.compareVersion(version, version_1.versionParse(this.iosDeployMinimumVersion));
    }
    validate() {
        if (this.xcode.isInstalled) {
            this.xcodeStatus = 2 /* installed */;
            this.messages.push(new doctor_1.ValidationMessage(`Xcode at ${this.xcode.xcodeSelectPath}`));
            this.xcodeVersionInfo = this.xcode.versionText;
            if (this.xcodeVersionInfo && this.xcodeVersionInfo.includes(',')) {
                this.xcodeVersionInfo = this.xcodeVersionInfo.substring(0, this.xcodeVersionInfo.indexOf(','));
                this.messages.push(new doctor_1.ValidationMessage(this.xcodeVersionInfo));
            }
            /**
             * installed and check xcode version
             */
            if (!this.xcode.isInstalledAndMeetsVersionCheck) {
                this.xcodeStatus = 1 /* partial */;
                this.messages.push(new doctor_1.ValidationMessage(`Weex requires a minimum Xcode version of ${mac_1.XcodeRequiredVersionMajor}.${mac_1.XcodeRequiredVersionMinor}.0.\n
          Download the latest version or update via the Mac App Store.`, true /* isError */));
            }
            /**
             * get admin
             */
            if (!this.xcode.eulaSigned) {
                this.xcodeStatus = 1 /* partial */;
                this.messages.push(new doctor_1.ValidationMessage("Xcode end user license agreement not signed; open Xcode or run the command 'sudo xcodebuild -license'.", true /* isError */));
            }
            if (!this.xcode.isSimctlInstalled) {
                this.xcodeStatus = 1 /* partial */;
                this.messages.push(new doctor_1.ValidationMessage(`Xcode requires additional components to be installed in order to run.\n'
          Launch Xcode and install additional required components when prompted.`, true /* isError */));
            }
        }
        else {
            this.xcodeStatus = 0 /* missing */;
            if (!this.xcode.xcodeSelectPath) {
                this.messages.push(new doctor_1.ValidationMessage(`Xcode not installed; this is necessary for iOS development.\n
          Download at https://developer.apple.com/xcode/download/.`, true /* isError */));
            }
            else {
                this.messages.push(new doctor_1.ValidationMessage(`Xcode installation is incomplete; a full installation is necessary for iOS development.\n
          Download at: https://developer.apple.com/xcode/download/\n
          Or install Xcode via the App Store.\n
          Once installed, run:\n
            sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer`, true /* isError */));
            }
        }
        // brew installed
        if (this.hasHomebrew) {
            this.brewStatus = 2 /* installed */;
            // if (!iMobileDevice.isInstalled) {
            //   this.brewStatus = ValidationType.partial
            //   this.messages.push(
            //     new ValidationMessage(
            //       `libimobiledevice and ideviceinstaller are not installed. To install, run:\n
            //     brew install --HEAD libimobiledevice\n
            //     brew install ideviceinstaller`,
            //       true /* isError */,
            //     ),
            //   )
            // } else if (!iMobileDevice.isWorking) {
            //   this.brewStatus = ValidationType.partial
            //   this.messages.push(
            //     new ValidationMessage(
            //       `Verify that all connected devices have been paired with this computer in Xcode.\n
            //     If all devices have been paired, libimobiledevice and ideviceinstaller may require updating.\n
            //     To update, run:\n
            //     brew uninstall --ignore-dependencies libimobiledevice\n
            //     brew install --HEAD libimobiledevice\n
            //     brew install ideviceinstaller`,
            //       true /* isError */,
            //     ),
            //   )
            // } else if (!this.hasIDeviceInstaller) {
            //   this.brewStatus = ValidationType.partial
            //   this.messages.push(
            //     new ValidationMessage(
            //       `ideviceinstaller is not installed; this is used to discover connected iOS devices.\n
            //     To install, run:\n
            //     brew install --HEAD libimobiledevice\n
            //     brew install ideviceinstaller`,
            //       true /* isError */,
            //     ),
            //   )
            // }
            // if (this.hasIosDeploy) {
            //   this.messages.push(new ValidationMessage(`ios-deploy ${this.iosDeployVersionText}`))
            // }
            // if (!this.iosDeployIsInstalledAndMeetsVersionCheck) {
            //   this.brewStatus = ValidationType.partial
            //   if (this.hasIosDeploy) {
            //     this.messages.push(
            //       new ValidationMessage(
            //         `ios-deploy out of date (${this.iosDeployMinimumVersion} is required). To upgrade:\n
            //       brew upgrade ios-deploy`,
            //         true /* isError */,
            //       ),
            //     );
            //   } else {
            //     this.messages.push(
            //       new ValidationMessage(
            //         `ios-deploy not installed. To install:\n
            //       brew install ios-deploy`,
            //         true /* isError */,
            //       ),
            //     )
            //   }
            // }
            const cocoaPodsStatus = this.cocoaPods.evaluateCocoaPodsInstallation;
            if (cocoaPodsStatus === cocoapods_1.CocoaPodsStatus.recommended) {
                if (this.cocoaPods.isCocoaPodsInitialized) {
                    this.messages.push(new doctor_1.ValidationMessage(`CocoaPods version ${this.cocoaPods.cocoaPodsVersionText}`));
                }
                else {
                    this.brewStatus = 1 /* partial */;
                    this.messages.push(new doctor_1.ValidationMessage(`CocoaPods installed but not initialized.\n
            ${cocoapods_1.noCocoaPodsConsequence}\n
            To initialize CocoaPods, run:\n
              pod setup\n
            once to finalize CocoaPods\' installation.`, true /* isError */));
                }
            }
            else {
                this.brewStatus = 1 /* partial */;
                if (cocoaPodsStatus === cocoapods_1.CocoaPodsStatus.notInstalled) {
                    this.messages.push(new doctor_1.ValidationMessage(`CocoaPods not installed.\n
    ${cocoapods_1.noCocoaPodsConsequence}\n
    To install:
    ${cocoapods_1.cocoaPodsInstallInstructions}`, true /* isError */));
                }
                else {
                    this.messages.push(new doctor_1.ValidationMessage(`CocoaPods out of date (${this.cocoaPods.cocoaPodsRecommendedVersion} is recommended).\n
            ${cocoapods_1.noCocoaPodsConsequence}\n
            To upgrade:\n
            ${cocoapods_1.cocoaPodsUpgradeInstructions}`, true /* isError */));
                }
            }
        }
        else {
            this.brewStatus = 0 /* missing */;
            this.messages.push(new doctor_1.ValidationMessage(`Brew not installed; use this to install tools for iOS device development.\n
        Download brew at https://brew.sh/.`, true /* isError */));
        }
        return new doctor_1.ValidationResult([this.xcodeStatus, this.brewStatus].reduce(this.mergeValidationTypes), this.messages, this.xcodeVersionInfo);
    }
    mergeValidationTypes(t1, t2) {
        return t1 === t2 ? t1 : 1 /* partial */;
    }
}
exports.IOSValidator = IOSValidator;
//# sourceMappingURL=ios-workflow.js.map