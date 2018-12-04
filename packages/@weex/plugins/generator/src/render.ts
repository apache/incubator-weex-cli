import { filter } from './utils/filter'
import * as chalk from 'chalk'
import * as async from 'async'
import * as Handlebars from 'handlebars'
import * as Metalsmith from 'metalsmith'
import * as consolidate from 'consolidate'
import * as multimatch from 'multimatch'
import * as path from 'path'

const render = consolidate.handlebars.render

const filters = {
  '.eslintrc.js': 'lint',
  '.eslintignore': 'lint',
  'configs/webpack.test.conf.js': 'unit',
  'build/webpack.test.conf.js': "unit && runner === 'karma'",
  'test/**/*': 'unit',
  'src/router.js': 'router',
}

// register handlebars helper
Handlebars.registerHelper('if_eq', function(a, b, opts) {
  return a === b ? opts.fn(this) : opts.inverse(this)
})

Handlebars.registerHelper('unless_eq', function(a, b, opts) {
  return a === b ? opts.inverse(this) : opts.fn(this)
})

interface Metadate {
  [propName: string]: any
}

export default function(source: string, dest = './build', metadata: Metadate) {
  return new Promise((resolve, reject) => {
    const metalsmith = Metalsmith(process.cwd());

    metadata.helpers && Object.keys(metadata.helpers).map(key => {
      Handlebars.registerHelper(key, metadata.helpers[key]);
    });

    const helpers = { chalk, logger: console };

    if (metadata.metalsmith && typeof metadata.metalsmith.before === 'function') {
      metadata.metalsmith.before(metalsmith, metadata, helpers);
    }

    if (typeof metadata.metalsmith === 'function') {
      metadata.metalsmith(metalsmith, metadata, helpers);
    }
    else if (metadata.metalsmith && typeof metadata.metalsmith.after === 'function') {
      metadata.metalsmith.after(metalsmith, metadata, helpers);
    }

    metalsmith
      .source(path.join(source, 'template'))
      .destination(dest)
      .clean(true)
      .metadata(metadata)
      .use(renderTemplateFiles(metadata.skipInterpolation))
      .use(filterFiles(metadata.filters || filters))
      .use(template)
      .build((err, files) => {
        if (err) throw err
        if (typeof metadata.complete === 'function') {
          const helpers = { chalk, logger: console, files };
          metadata.complete(metadata, helpers);
        }
      })
    resolve(metadata)
  })
}

/**
 * Template in place plugin.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */
function template(files, metalsmith, done) {
  const keys = Object.keys(files)
  const metalsmithMetadata = metalsmith.metadata()
  async.each(
    keys,
    (file, next) => {
      const rawFileName = file
      const rawBuffer = files[file]
      const contents = rawBuffer.contents.toString()
      // do not attempt to render files that do not have mustaches
      if (!/{{([^{}]+)}}/g.test(contents) && !/{{([^{}]+)}}/g.test(file)) {
        return next()
      }

      // first replace filename
      render(file, metalsmithMetadata, (err, res) => {
        if (err) {
          err.message = `[${file}] ${err.message}`
          return next(err)
        }
        file = res
        // second replace file contents
        render(contents, metalsmithMetadata, (err, res) => {
          if (err) {
            err.message = `[${file}] ${err.message}`
            return next(err)
          }
          files[file] = rawBuffer
          files[file].contents = Buffer.from(res)

          // delete old buffer
          if (rawFileName !== file) {
            files[rawFileName] = null
            delete files[rawFileName]
          }
          next()
        })
      })
    },
    done,
  )
}

/**
 * Create a middleware for filtering files.
 *
 * @param {Object} filters
 * @return {Function}
 */
function filterFiles(filters) {
  return (files, metalsmith, done) => {
    filter(files, filters, metalsmith.metadata(), done)
  }
}

/**
 * Template in place plugin.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */
function renderTemplateFiles (skipInterpolation) {
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
  };
}