"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const match = require('minimatch');
const eval_1 = require("./eval");
exports.filter = (files, filters, data, done) => {
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
};
//# sourceMappingURL=filter.js.map