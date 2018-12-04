"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const match = require("minimatch");
const eval_1 = require("./eval");
/**
 * Filter files
 *
 * @param files
 * @param filters
 * @param data
 * @param done
 */
function filter(files, filters, data, done) {
    if (!filters) {
        return done();
    }
    const fileNames = Object.keys(files);
    Object.keys(filters).forEach(glob => {
        fileNames.forEach(file => {
            if (match(file, glob, { dot: true })) {
                const condition = filters[glob];
                if (!eval_1.default(condition, data)) {
                    delete files[file];
                }
            }
        });
    });
    done();
}
exports.filter = filter;
exports.default = filter;
//# sourceMappingURL=filter.js.map