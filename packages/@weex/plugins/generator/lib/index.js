"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./utils/index");
const download = require('download-git-repo');
const path = require("path");
const fs = require("fs");
const render_1 = require("./render");
const rimraf = require("rimraf");
const defautlTarget = path.join(path.dirname(__dirname), index_1.TEMPLATE_NAME);
function generator(projectName, source, dest, metadata) {
    console.log('generator.ts', projectName, source, dest);
    return new Promise((resolve, reject) => {
        render_1.default(source, dest, metadata);
    });
}
exports.generator = generator;
function clone(templateUrl, target = defautlTarget, option) {
    console.log('templateUrl', templateUrl, target);
    return new Promise((resolve, reject) => {
        if (option && option.cache) {
            resolve(target);
        }
        else if (fs.existsSync(target)) {
            rimraf(target, () => {
                done();
            });
        }
        else {
            done();
        }
        function done() {
            download(templateUrl, target, { clone: true }, (err) => {
                // download('direct:https://github.com/balloonzzq/webpack.git#temp', target, { clone: true }, (err) => {
                console.log(err ? 'downloadError' : 'Success');
                if (err) {
                    reject(err);
                }
                else {
                    resolve(target);
                }
            });
        }
    });
}
exports.clone = clone;
//# sourceMappingURL=index.js.map