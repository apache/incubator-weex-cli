/**
 * the design is to standardize the Error information,and the user of the interface can obtain
 * the Error type through the Error information to do the corresponding processing
 * 1. A lot of errors may occur in a method, through ` createError ` generates standardized error throw out directly tell the caller,
 *    without having to pass it
 * 2. The interface user can through ` paraError ` to parse out standardized error
 */
export declare function createError(options: {
    message: string;
    type: string;
}): Error;
export declare function paraError(error: Error): any;
