"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Metalsmith = require('metalsmith');
const render = require('consolidate').handlebars.render;
const async = require('async');
const Handlebars = require('handlebars');
const filter_1 = require("./utils/filter");
const filters = {
    '.eslintrc.js': 'lint',
    '.eslintignore': 'lint',
    'configs/webpack.test.conf.js': 'unit',
    'build/webpack.test.conf.js': "unit && runner === 'karma'",
    'test/**/*': 'unit',
    'src/router.js': 'router'
};
// register handlebars helper
Handlebars.registerHelper('if_eq', function (a, b, opts) {
    return a === b ? opts.fn(this) : opts.inverse(this);
});
Handlebars.registerHelper('unless_eq', function (a, b, opts) {
    return a === b ? opts.inverse(this) : opts.fn(this);
});
function default_1(source, dest = './build', metadata) {
    Metalsmith(process.cwd())
        .source(source)
        .destination(dest)
        .clean(true)
        .metadata(metadata)
        .use(filterFiles(filters))
        .use(template)
        .build(function (err) {
        if (err)
            throw err;
    });
}
exports.default = default_1;
;
/**
 * Template in place plugin.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */
function template(files, metalsmith, done) {
    const keys = Object.keys(files);
    const metalsmithMetadata = metalsmith.metadata();
    async.each(keys, (file, next) => {
        const rawFileName = file;
        const rawBuffer = files[file];
        const contents = rawBuffer.contents.toString();
        // do not attempt to render files that do not have mustaches
        if (!/{{([^{}]+)}}/g.test(contents) && !/{{([^{}]+)}}/g.test(file)) {
            return next();
        }
        // first replace filename
        render(file, metalsmithMetadata, (err, res) => {
            if (err) {
                err.message = `[${file}] ${err.message}`;
                return next(err);
            }
            file = res;
            // second replace file contents
            render(contents, metalsmithMetadata, (err, res) => {
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
}
/**
 * Create a middleware for filtering files.
 *
 * @param {Object} filters
 * @return {Function}
 */
function filterFiles(filters) {
    return (files, metalsmith, done) => {
        filter_1.filter(files, filters, metalsmith.metadata(), done);
    };
}
//# sourceMappingURL=render.js.map