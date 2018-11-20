"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./utils/index");
const path = require("path");
const fs = require("fs");
const render_1 = require("./render");
const rimraf = require("rimraf");
const download = require("download-git-repo");
const options_1 = require("./options");
const Metalsmith = require("metalsmith");
const Handlebars = require("handlebars");
const chalk = require("chalk");
const async = require("async");
const multimatch = require("multimatch");
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
    return new Promise((resolve, reject) => {
        render_1.default(source, dest, metadata);
    });
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
function pretreatment(name, source, target, opts) {
    const metalsmith = Metalsmith(path.join(source, 'template'));
    const data = Object.assign(metalsmith.metadata(), {
        destDirName: name,
        inPlace: target === process.cwd(),
        noEscape: true
    });
    opts.helpers && Object.keys(opts.helpers).map(key => {
        Handlebars.registerHelper(key, opts.helpers[key]);
    });
    const helpers = { chalk, logger: console };
    if (opts.metalsmith && typeof opts.metalsmith.before === 'function') {
        opts.metalsmith.before(metalsmith, opts, helpers);
    }
    metalsmith.use(opts)
        .use(renderTemplateFiles(opts.skipInterpolation));
    if (typeof opts.metalsmith === 'function') {
        opts.metalsmith(metalsmith, opts, helpers);
    }
    else if (opts.metalsmith && typeof opts.metalsmith.after === 'function') {
        opts.metalsmith.after(metalsmith, opts, helpers);
    }
}
exports.pretreatment = pretreatment;
/**
 * Template in place plugin.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */
function renderTemplateFiles(skipInterpolation) {
    skipInterpolation = typeof skipInterpolation === 'string'
        ? [skipInterpolation]
        : skipInterpolation;
    return (files, metalsmith, done) => {
        const keys = Object.keys(files);
        const metalsmithMetadata = metalsmith.metadata();
        async.each(keys, (file, next) => {
            // skipping files with skipInterpolation option
            if (skipInterpolation && multimatch([file], skipInterpolation, { dot: true }).length) {
                return next();
            }
            const rawFileName = file;
            const rawBuffer = files[file];
            const contents = rawBuffer.contents.toString();
            // do not attempt to render files that do not have mustaches
            if (!/{{([^{}]+)}}/g.test(contents) && !/{{([^{}]+)}}/g.test(file)) {
                return next();
            }
            // first replace filename
            render_1.default(file, metalsmithMetadata, (err, res) => {
                if (err) {
                    err.message = `[${file}] ${err.message}`;
                    return next(err);
                }
                file = res;
                // second replace file contents
                render_1.default(contents, metalsmithMetadata, (err, res) => {
                    if (err) {
                        err.message = `[${file}] ${err.message}`;
                        return next(err);
                    }
                    files[file] = rawBuffer;
                    files[file].contents = new Buffer(res);
                    // delete old buffer
                    if (rawFileName !== file) {
                        files[rawFileName] = null;
                        delete files[rawFileName];
                    }
                    next();
                });
            });
        }, done);
    };
}
//# sourceMappingURL=index.js.map