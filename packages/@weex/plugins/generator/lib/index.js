"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./utils/index");
const path = require("path");
const fs = require("fs");
const render_1 = require("./render");
const rimraf = require("rimraf");
const download = require("download-git-repo");
const options_1 = require("./options");
const defautlTarget = path.join(path.dirname(__dirname), index_1.TEMPLATE_NAME);
/**
 * Generate source with meatdata
 *
 * @export
 * @param {string} source
 * @param {string} dest
 * @param {Metadate} metadata
 * @returns {Promise<boolean>}
 */
function generator(source, dest, metadata) {
    return render_1.default(source, dest, metadata);
}
exports.generator = generator;
/**
 * Download template from a specify url
 *
 * @export
 * @param {string} templateUrl
 * @param {*} [target=defautlTarget]
 * @param {CloneOption} [option]
 * @returns
 */
function clone(templateUrl, target = defautlTarget, option) {
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
            download(templateUrl, target, { clone: true }, err => {
                // download('direct:https://github.com/balloonzzq/webpack.git#temp', target, { clone: true }, (err) => {
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
/**
 * Get options from template's meta.json or meta.js
 *
 * @export
 * @param {string} name
 * @param {string} dir
 * @param {*} opt
 * @returns
 */
function getOptions(name, dir, opt) {
    return options_1.default(name, dir, opt);
}
exports.getOptions = getOptions;
//# sourceMappingURL=index.js.map