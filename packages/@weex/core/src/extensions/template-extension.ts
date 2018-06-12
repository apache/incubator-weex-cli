import { Options } from '../core/options'
import { filesystem } from '../toolbox/filesystem-tools'
import { strings } from '../toolbox/string-tools'
import { logger } from '../toolbox/logger-tools'
import { IToolbox } from '../core/toolbox'
import * as Handlebars from 'handlebars'
import * as Metalsmith from 'metalsmith'
import * as Consolidate from 'consolidate'
import * as multimatch from 'multimatch'
import * as validateName from 'validate-npm-package-name'
import * as path from 'path'
import * as Async from 'async'
import * as match from 'minimatch'
import * as download from 'download-git-repo'
import * as inquirer from 'inquirer'

const { isLocalPath, getAbsolutePath } = filesystem
const parser = Consolidate.handlebars.render

// Support types from prompt-for which was used before
const promptMapping = {
  string: 'input',
  boolean: 'confirm'
};

export interface ITemplate {
  generate(directory: string, template: string, options: Options, data?: any): Promise<string>
}

export interface IGenerateOptions {
  helpers: any
}

/**
 * Builds the code generation feature.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: IToolbox): void {
  // register handlebars helper
  Handlebars.registerHelper('if_eq', function (a, b, opts) {
    return a === b
      ? opts.fn(Handlebars)
      : opts.inverse(Handlebars);
  });

  Handlebars.registerHelper('unless_eq', function (a, b, opts) {
    return a === b
      ? opts.inverse(Handlebars)
      : opts.fn(Handlebars);
  });

  /**
   * Generates a file from a template.
   *
   * @param directory Target path.
   * @param template Git/Gitlab or local path.
   * @param options options for download template.
   * @param data data for rending.
   * @return The generated string.
   */
  async function generate(directory: string, template: string, options: Options, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const dirname = path.basename(directory);
      if (isLocalPath(template)) {
        const templatePath = getAbsolutePath(template);
        if (filesystem.exists(templatePath)) {
          render(dirname, templatePath, directory, (err: any) => {
            if (err) {
              logger.error(err)
            }
            else {
              logger.success(`Generated ${dirname}`);
            }
          }, data);
        }
        else {
          logger.error(`Local template "${template}" not found.`);
        }
      }
      // download template from git.
      else {
        const tmp = path.join(filesystem.homedir(), '.weex-templates', template.replace(/\//g, '-'));
        const spinner = logger.spin(`Downloading template from ${template} repo`);
        spinner.start();
        // Remove if local template exists
        if (filesystem.exists(tmp)){
          filesystem.remove(tmp);
        }
        download(template, tmp, options, err => {
          spinner.stop();
          if (err) logger.error('Failed to download repo ' + template + ': ' + err.message.trim());
          render(dirname, tmp, directory, err => {
            if (err) logger.error(err);
            logger.success(`Generated ${dirname}`);
          }, options && options.defaultProps);
        });
      }
    });
  }

  /**
   * Render files
   *
   * @param name 
   * @param source source path
   * @param target target path.
   * @param done callback function
   * @return data
   */
  async function render(name: string, source: string, target: string, done: any, options?: any) {
    const opts = await getOptions(name, source, options);
    const metalsmith = Metalsmith(path.join(source, 'template'));
    const data = Object.assign(metalsmith.metadata(), {
      destDirName: name,
      inPlace: target === process.cwd()
    })
    opts['helpers'] && Object.keys(opts['helpers']).map(key => {
      Handlebars.registerHelper(key, opts['helpers'][key]);
    })

    const helpers = { logger }
    
    if (opts['metalsmith'] && typeof opts['metalsmith']['before'] === 'function') {
      opts['metalsmith']['before'](metalsmith, opts, helpers);
    }
    metalsmith.use(askQuestions(opts['prompts']))
      .use(filterFiles(opts['filters']))
      .use(renderTemplateFiles(opts['skipInterpolation']));
  
    if (typeof opts['metalsmith'] === 'function') {
      opts['metalsmith'](metalsmith, opts, helpers);
    }
    else if (opts['metalsmith'] && typeof opts['metalsmith']['after'] === 'function') {
      opts['metalsmith']['after'](metalsmith, opts, helpers);
    }
  
    metalsmith.clean(false)
      .source('.') // start from template root instead of `./src` which is Metalsmith's default for `source`
      .destination(target)
      .build((err, files) => {
        done(err);
        if (typeof opts['complete'] === 'function') {
          const helpers = { logger, files };
          opts['complete'](data, helpers);
        }
        else {
          logMessage(opts['completeMessage'], data);
        }
      });
  
    return data;
  }

  /**
   * Display template complete message.
   *
   * @param message
   * @param data
   */
  function logMessage (message, data) {
    if (!message) return;
    parser(message, data, (err, res) => {
      if (err) {
        logger.error('\n   Error when rendering template complete message: ' + err.message.trim());
      }
      else {
        logger.log('\n' + res.split(/\r?\n/g).map(line => '   ' + line).join('\n'));
      }
    });
  }

  /**
   * Create a middleware for asking questions.
   *
   * @param prompts
   * @return
   */
  function askQuestions (prompts) {
    return (files, metalsmith, done) => {
      ask(prompts, metalsmith.metadata(), done);
    };
  }

  /**
   * Ask questions, return results.
   *
   * @param prompts
   * @param data
   * @param done
   */
  function ask (prompts, data, done) {
    Async.eachSeries(Object.keys(prompts), (key, next) => {
      prompt(data, key, prompts[key], next);
    }, done);
  };

  /**
   * Inquirer prompt wrapper.
   *
   * @param data
   * @param key
   * @param prompt
   * @param done
   */
  function prompt (data, key, prompt, done) {
    // skip prompts whose when condition is not met
    if (prompt.when && !evaluate(prompt.when, data)) {
      return done()
    }

    let promptDefault = prompt.default;
    if (typeof prompt.default === 'function') {
      promptDefault = function () {
        return prompt.default.bind(this)(data);
      };
    }

    inquirer.prompt([{
      type: promptMapping[prompt.type] || prompt.type,
      name: key,
      message: prompt.message || prompt.label || key,
      default: promptDefault,
      choices: prompt.choices || [],
      validate: prompt.validate || (() => true)
    }]).then(answers => {
      if (Array.isArray(answers[key])) {
        data[key] = {};
        answers[key].forEach(multiChoiceAnswer => {
          data[key][multiChoiceAnswer] = true;
        });
      }
      else if (typeof answers[key] === 'string') {
        data[key] = answers[key].replace(/"/g, '\\"');
      }
      else {
        data[key] = answers[key];
      }
      done();
    }).catch(done);
  }

  /**
   * Create a middleware for filtering files.
   *
   * @param filters
   * @return
   */
  function filterFiles (filters) {
    return (files, metalsmith, done) => {
      filter(files, filters, metalsmith.metadata(), done);
    };
  }


  /**
   * Filter the files which match the pattern.
   *
   * @param files
   * @param filters
   * @param data
   * @param done
   * @return
   */
  function filter(files, filters, data, done){
    if (!filters) {
      return done();
    }
    const fileNames = Object.keys(files);
    Object.keys(filters).forEach(glob => {
      fileNames.forEach(file => {
        if (match(file, glob, { dot: true })) {
          const condition = filters[glob];
          if (!evaluate(condition, data)) {
            delete files[file];
          }
        }
      });
    });
    return done();
  }

  /**
   * Evaluate an expression in meta.json in the context of
   * prompt answers data.
   */
  function evaluate (exp, data) {
    /* eslint-disable no-new-func */
    const fn = new Function('data', 'with (data) { return ' + exp + '}');
    try {
      return fn(data);
    }
    catch (e) {
      logger.error('Error when evaluating filter condition: ' + exp);
    }
  };

  /**
   * Template in place plugin.
   *
   * @param files
   * @param {Metalsmith} metalsmith
   * @param done
   */

  function renderTemplateFiles (skipInterpolation) {
    skipInterpolation = typeof skipInterpolation === 'string'
      ? [skipInterpolation]
      : skipInterpolation;
    return (files, metalsmith, done) => {
      const keys = Object.keys(files);
      const metalsmithMetadata = metalsmith.metadata();
      Async.each(keys, (file, next) => {
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
        parser(file, metalsmithMetadata, (err, res) => {
          if (err) {
            err.message = `[${file}] ${err.message}`;
            return next(err);
          }
          file = res;
          // second replace file contents
          parser(contents, metalsmithMetadata, (err, res) => {
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

  /**
   * Read prompts metadata.
   *
   * @param name
   * @param dir
   * @param opt
   * @return {Object}
   */
  async function getOptions (name: string, dir: string, opt: any){
    const opts = await getMetadata(dir);
  
    setDefault(opts, 'name', name);
    setValidateName(opts);
  
    for (const key in opt) {
      setDefault(opts, key, opt[key]);
    }
  
    return opts;
  };

  /**
   * Gets the metadata from either a meta.json or meta.js file.
   *
   * @param  dir
   * @return {Object}
   */
  async function getMetadata (dir: string) {
    const json = path.join(dir, 'meta.json');
    const js = path.join(dir, 'meta.js');
    let opts = {};

    if (filesystem.exists(json)) {
      opts = await filesystem.readAsync(json);
    }
    else if (filesystem.exists(js)) {
      const req = require(path.resolve(js));
      if (req !== Object(req)) {
        throw new Error('meta.js needs to expose an object');
      }
      opts = req;
    }
    return opts;
  }


  /**
   * Set the default value for a prompt question
   *
   * @param opts
   * @param key
   * @param val
   */
  function setDefault (opts, key, val) {
    if (opts.schema) {
      opts.prompts = opts.schema;
      delete opts.schema;
    }
    const prompts = opts.prompts || (opts.prompts = {});
    if (!prompts[key] || typeof prompts[key] !== 'object') {
      prompts[key] = {
        'type': 'string',
        'default': val
      };
    }
    else {
      prompts[key]['default'] = val;
    }
  }

  /**
   * Validate the name of prompts
   *
   * @param opts
   */
  function setValidateName (opts) {
    const name = opts.prompts.name;
    const customValidate = name.validate;
    name.validate = name => {
      const its = validateName(name);
      if (!its.validForNewPackages) {
        const errors = (its.errors || []).concat(its.warnings || []);
        return 'Sorry, ' + errors.join(' and ') + '.';
      }
      if (typeof customValidate === 'function') return customValidate(name);
      return true;
    };
  }

  toolbox.template = { generate }
}
