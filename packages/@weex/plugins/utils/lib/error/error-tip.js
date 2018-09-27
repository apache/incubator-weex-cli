"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_list_1 = require("./error-list");
const cocoapods_1 = require("../ios/cocoapods");
function getErrorTip(errorKey) {
    switch (errorKey) {
        case error_list_1.ERROR_LIST.ANDROID_ADB_NOT_FIND:
            return {
                title: `Not find android sdk!`,
                tip: `Unable to locate Android SDK.
        Install Android Studio from: https://developer.android.com/studio/index.html
        On first launch it will assist you in installing the Android SDK components.
        If Android SDK has been installed to a custom location, set ANDROID_HOME to that location.`
            };
        case error_list_1.ERROR_LIST.IOS_XCODE_NOT_INSTALLED:
            return {
                title: `Xcode not installed!`,
                tip: `Xcode not installed; this is necessary for iOS development.\n
        Download at https://developer.apple.com/xcode/download/.`
            };
        case error_list_1.ERROR_LIST.IOS_COCOAPODS_NOT_INITIALIZED:
            return {
                title: `CocoaPods installed but not initialized!`,
                tip: `CocoaPods installed but not initialized.\n
        ${cocoapods_1.noCocoaPodsConsequence}\n
        To initialize CocoaPods, run:\n
          pod setup\n
        once to finalize CocoaPods\' installation.`
            };
        case error_list_1.ERROR_LIST.IOS_COCOAPODS_NOT_INSTALLED:
            return {
                title: `CocoaPods not installed!`,
                tip: `CocoaPods not installed.\n
        ${cocoapods_1.noCocoaPodsConsequence}\n
        To install:
        ${cocoapods_1.cocoaPodsInstallInstructions}`
            };
    }
}
exports.getErrorTip = getErrorTip;
//# sourceMappingURL=error-tip.js.map