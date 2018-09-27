"use strict";
/**
 * the design is to standardize the Error information,and the user of the interface can obtain
 * the Error type through the Error information to do the corresponding processing
 * 1. A lot of errors may occur in a method, through ` createError ` generates standardized error throw out directly tell the caller,
 *    without having to pass it
 * 2. The interface user can through ` paraError ` to parse out standardized error
 */
Object.defineProperty(exports, "__esModule", { value: true });
const label = 'ErrorMemory';
function createError(options) {
    return new Error(JSON.stringify(Object.assign({
        [label]: 'ErrorMemory',
    }, options)));
}
exports.createError = createError;
function paraError(error) {
    let result = null;
    try {
        result = JSON.parse(error.message);
    }
    catch (e) {
        return result;
    }
    if (!result[label]) {
        result = null;
    }
    delete result[label];
    return result;
}
exports.paraError = paraError;
//# sourceMappingURL=error.js.map