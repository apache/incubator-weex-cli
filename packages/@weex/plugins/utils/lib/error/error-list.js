"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("./error");
var ERROR_LIST;
(function (ERROR_LIST) {
    ERROR_LIST["ANDROID_SDK_NOT_FIND"] = "ANDROID_SDK_NOT_FIND";
    ERROR_LIST["ANDROID_ADB_NOT_FIND"] = "ANDROID_ADB_NOT_FIND";
    ERROR_LIST["ANDROID_EMULATOR_NOT_FIND"] = "ANDROID_EMULATOR_NOT_FIND";
    ERROR_LIST["ANDROID_NDK_NOT_FIND"] = "ANDROID_NDK_NOT_FIND";
    ERROR_LIST["IOS_XCODE_NOT_INSTALLED"] = "IOS_XCODE_NOT_INSTALLED";
})(ERROR_LIST = exports.ERROR_LIST || (exports.ERROR_LIST = {}));
exports.ANDROID_SDK_NOT_FIND = error_1.createError({
    type: ERROR_LIST.ANDROID_ADB_NOT_FIND,
    message: `Not find android sdk!`,
});
exports.ANDROID_ADB_NOT_FIND = error_1.createError({
    type: ERROR_LIST.ANDROID_ADB_NOT_FIND,
    message: `Not find android adb!`,
});
exports.ANDROID_EMULATOR_NOT_FIND = error_1.createError({
    type: ERROR_LIST.ANDROID_EMULATOR_NOT_FIND,
    message: `Not find android emulator!`,
});
exports.ANDROID_NDK_NOT_FIND = error_1.createError({
    type: ERROR_LIST.ANDROID_NDK_NOT_FIND,
    message: `Not find android ndk!`,
});
exports.IOS_XCODE_NOT_INSTALLED = error_1.createError({
    type: ERROR_LIST.IOS_XCODE_NOT_INSTALLED,
    message: `Xcode not installed!`,
});
//# sourceMappingURL=error-list.js.map