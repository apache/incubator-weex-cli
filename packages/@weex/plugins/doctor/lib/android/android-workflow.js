"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AndroidWorkflow {
    get appliesToHostPlatform() {
        return true;
    }
}
exports.AndroidWorkflow = AndroidWorkflow;
exports.androidWorkflow = new AndroidWorkflow();
class AndroidValidator {
    constructor() {
        this.messages = [];
    }
    validate() {
        // android-sdk
        if (!AndroidSdkValue) {
        }
    }
}
exports.AndroidValidator = AndroidValidator;
//# sourceMappingURL=android-workflow.js.map