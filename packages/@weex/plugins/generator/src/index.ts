import { TEMPLATE_NAME } from './utils/index'
import * as path from 'path'
import * as fs from 'fs'
import render from './render'
import * as rimraf from 'rimraf'
import * as download from 'download-git-repo'
import options from './options'
import * as Metalsmith from 'metalsmith'
import * as Handlebars from 'handlebars'
import * as chalk from 'chalk'
import * as async from 'async'
import * as multimatch from 'multimatch'

interface Metadate {
  [propName: string]: any
}

const defautlTarget = path.join(path.dirname(__dirname), TEMPLATE_NAME)

/**
 * Generate source with meatdata
 *
 * @export
 * @param {string} source
 * @param {string} dest
 * @param {Metadate} metadata
 * @returns {Promise<boolean>}
 */
export function generator(source: string, dest: string, metadata: Metadate): Promise<boolean> {
  return new Promise((resolve, reject) => {
    render(source, dest, metadata)
  })
}

interface CloneOption {
  cache: boolean
}

/**
 * Download template from a specify url
 *
 * @export
 * @param {string} templateUrl
 * @param {*} [target=defautlTarget]
 * @param {CloneOption} [option]
 * @returns
 */
export function clone(templateUrl: string, target = defautlTarget, option?: CloneOption) {
  return new Promise((resolve, reject) => {
    if (option && option.cache) {
      resolve(target)
    } else if (fs.existsSync(target)) {
      rimraf(target, () => {
        done()
      })
    } else {
      done()
    }
    function done() {
      download(templateUrl, target, { clone: true }, err => {
        // download('direct:https://github.com/balloonzzq/webpack.git#temp', target, { clone: true }, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(target)
        }
      })
    }
  })
}

/**
 * Get options from template's meta.json or meta.js
 *
 * @export
 * @param {string} name
 * @param {string} dir
 * @param {*} opt
 * @returns
 */
export function getOptions(name: string, dir: string, opt: Metadate) {
  return options(name, dir, opt)
}

export function pretreatment(name: string, source: string, target: string, opts: Metadate) {
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
