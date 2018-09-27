"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const doctor_1 = require("../doctor");
const android_sdk_1 = require("./android-sdk");
const licenseAccepted = new RegExp('All SDK package licenses accepted.');
var LicensesAccepted;
(function (LicensesAccepted) {
    LicensesAccepted[LicensesAccepted["none"] = 0] = "none";
    LicensesAccepted[LicensesAccepted["some"] = 1] = "some";
    LicensesAccepted[LicensesAccepted["all"] = 2] = "all";
    LicensesAccepted[LicensesAccepted["unknown"] = 3] = "unknown";
})(LicensesAccepted || (LicensesAccepted = {}));
class AndroidWorkflow {
    get appliesToHostPlatform() {
        return true;
    }
}
exports.AndroidWorkflow = AndroidWorkflow;
class AndroidValidator {
    constructor() {
        this.messages = [];
        this.androidSdk = new android_sdk_1.AndroidSdk();
        this.title = 'Android toolchain - develop for Android devices';
    }
    validate() {
        // android-sdk
        if (!this.androidSdk.directory) {
            // No Android SDK found.
            if (process.env[`${android_sdk_1.kAndroidHome}`]) {
                const androidHomeDir = process.env[`${android_sdk_1.kAndroidHome}`];
                this.messages.push(new doctor_1.ValidationMessage(`${android_sdk_1.kAndroidHome} = ${androidHomeDir}
            but Android SDK not found at this location.`, true /* isError */));
            }
            else {
                this.messages.push(new doctor_1.ValidationMessage(`Unable to locate Android SDK.
            Install Android Studio from: https://developer.android.com/studio/index.html
            On first launch it will assist you in installing the Android SDK components.
            If Android SDK has been installed to a custom location, set ${android_sdk_1.kAndroidHome} to that location.`, true /* isError */));
            }
            return new doctor_1.ValidationResult(0 /* missing */, this.messages);
        }
        this.messages.push(new doctor_1.ValidationMessage(`Android SDK at ${this.androidSdk.directory}`));
        let sdkVersionText;
        if (this.androidSdk.latestVersion) {
            sdkVersionText = `Android SDK ${this.androidSdk.latestVersion.buildToolsVersionName}`;
            this.messages.push(new doctor_1.ValidationMessage(`Platform ${this.androidSdk.latestVersion.platformName}, build-tools ${this.androidSdk.latestVersion.buildToolsVersionName}`));
        }
        if (process.env[`${android_sdk_1.kAndroidHome}`]) {
            const androidHomeDir = process.env[`${android_sdk_1.kAndroidHome}`];
            this.messages.push(new doctor_1.ValidationMessage(`${android_sdk_1.kAndroidHome} = ${androidHomeDir}\n`));
        }
        const validationResult = this.androidSdk.validateSdkWellFormed();
        if (validationResult.length) {
            // Android SDK is not functional.
            validationResult.forEach(message => {
                this.messages.push(new doctor_1.ValidationMessage(message, true /* isError */));
            });
            this.messages.push(new doctor_1.ValidationMessage(`Try re-installing or updating your Android SDK,
          visit https://flutter.io/setup/#android-setup for detailed instructions.`));
            return new doctor_1.ValidationResult(1 /* partial */, this.messages, sdkVersionText);
        }
        // Now check for the JDK.
        // const javaBinary = AndroidSdk.findJavaBinary();
        // Check JDK version.
        // Check for licenses.
        // Success.
        return new doctor_1.ValidationResult(2 /* installed */, this.messages, sdkVersionText);
    }
    licensesAccepted() {
        let status;
    }
}
exports.AndroidValidator = AndroidValidator;
//# sourceMappingURL=android-workflow.js.map