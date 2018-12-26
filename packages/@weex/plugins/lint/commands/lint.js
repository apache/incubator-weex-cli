const {
  Linter
} = require('../lib')
const debug = require('debug')('lint')

module.exports = {
  name: 'lint',
  alias: 'l',
  description: 'Lint codes and generate code report',
  run: async ({
    logger,
    parameters,
    inquirer,
    meta
  }) => {
    const files = parameters.array
    const options = parameters.options
    const useStdin = typeof text === "string"
    let spinner = null
    const translateOptions = (cliOptions) => {
      return {
        envs: cliOptions.env,
        extensions: cliOptions.ext,
        rules: cliOptions.rule,
        plugins: cliOptions.plugin,
        globals: cliOptions.global,
        ignore: cliOptions.ignore,
        ignorePath: cliOptions.ignorePath,
        ignorePattern: cliOptions.ignorePattern,
        configFile: cliOptions.config,
        rulePaths: cliOptions.rulesdir,
        useEslintrc: cliOptions.eslintrc,
        parser: cliOptions.parser,
        parserOptions: cliOptions.parserOptions,
        cache: cliOptions.cache,
        cacheFile: cliOptions.cacheFile || '',
        cacheLocation: cliOptions.cacheLocation || '',
        fix: (cliOptions.fix || cliOptions.fixDryRun) && (cliOptions.quiet ? quietFixPredicate : true),
        fixTypes: cliOptions.fixType,
        allowInlineConfig: cliOptions.inlineConfig,
        reportUnusedDisableDirectives: cliOptions.reportUnusedDisableDirectives
      };
    }
    /**
     * Outputs the results of the linting.
     * @param {CLIEngine} engine The CLIEngine to use.
     * @param {LintResult[]} results The results to print.
     * @param {string} format The name of the formatter to use or the path to the formatter.
     * @param {string} outputFile The path for the output file.
     * @returns {boolean} True if the printing succeeds, false if not.
     * @private
     */
    const printResults = (engine, results, format, outputFile) => {
      let formatter;
      results.forEach(r => {
        spinner.stopAndPersist({
          symbol: r.errorCount > 0 ? logger.colors.red(logger.xmark) : logger.colors.green(logger.checkmark),
          text: `${r.filePath}`
        })
      })
      try {
        formatter = engine.getFormatter(format);
      } catch (e) {
        logger.error(e.message);
        return false;
      }

      const output = formatter(results);

      if (output) {
        if (outputFile) {
          const filePath = path.resolve(process.cwd(), outputFile);

          if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
            logger.error("Cannot write to output file path, it is a directory: %s", outputFile);
            return false;
          }

          try {
            mkdirp.sync(path.dirname(filePath));
            fs.writeFileSync(filePath, output);
          } catch (ex) {
            logger.error("There was a problem writing the output file:\n%s", ex);
            return false;
          }
        } else {
          logger.info(output);
        }
      }

      return true;

    }

    const showHelp = async () => {
      let params = {
        append: 'This script has alias(l), you can run it like \`weex l [options] file.js [file.js] [dir]\`',
        commandend: 'Run the lint script to check if your code has a problem',
        commands: [
          {
            heading: ['Usage', 'Description']
          },
          {
            key: 'lint',
            alias: 'l',
            type: '[options] file.js [file.js] [dir]',
            description: 'Lint weex code'
          }
        ],
        options: {
          'Basic configuration:': [
            {
              key:'-c, --config',
              type: 'path::String',
              description: 'Use configuration from this file or shareable config',
              default: ''
            },
            {
              key:'--no-eslintrc',
              description: 'Disable use of configuration from .eslintrc',
              default: 'true'
            },
            {
              key:'--env',
              type: '[String]',
              description: 'Specify environments',
              default: ''
            },
            {
              key:'--global',
              type: '[String]',
              description: 'Define global variables'
            },
            {
              key:'--parser',
              type: 'String',
              description: 'Specify the parser to be used',
            },
            {
              key:'--parser-options',
              type: 'Object',
              description: 'Specify parser options',
            }
          ],
          'Caching:': [
            {
              key: '--cache',
              description:'Only check changed files',
              default: 'false'
            },
            {
              key: '--cache-file',
              type:'path::String',
              description:'Path to the cache file. Deprecated: use --cache-location',
              default: '.eslintcache'
            },
            {
              key: '--cache-location',
              type:'path::String',
              description:'Path to the cache file or directory',
            }
          ],
          'Handling warnings:': [
            {
              key: '--quiet',
              type:'path::String',
              description:'Report errors only',
              default: 'false'
            },
            {
              key: '-f, --format',
              type:'String',
              description:'Use a specific output format',
              default: 'stylish'
            },
            {
              key: '--color, --no-color',
              description:'Force enabling/disabling of color',
            }
          ],
          'Ignoring files:': [
            {
              key: '-ignore-path',
              type:'path::String',
              description:'Specify path of ignore file',
            },
            {
              key: '--no-ignore',
              description:'Disable use of ignore files and patterns',
            },
            {
              key: '--ignore-pattern',
              type:'[String]',
              description:'Pattern of files to ignore (in addition to those in .eslintignore)',
            }
          ],
          'Specifying rules and plugins:': [
            {
              key:'-rulesdir',
              type: '[path::String]',
              description: 'Use additional rules from this directory'
            },
            {
              key:'--rule',
              type: 'Object',
              description: 'Specify rules'
            },
            {
              key:'--plugin',
              type: '[String]',
              description: 'Specify plugins'
            },
          ],
          'Miscellaneous:': [
            {
              key:'-v, --version',
              description: 'Output the version number'
            },
            {
              key:'-h, --help',
              description: 'Show help'
            },
            {
              key:'--fix',
              description: 'Automatically fix problems'
            },
            {
              key:'--fix-dry-run',
              description: 'Automatically fix problems without saving the changes to the file system'
            },
            {
              key:'--no-inline-config',
              description: 'Prevent comments from changing config or rules'
            },
            {
              key:'--report-unused-disable-directives',
              description: 'Adds reported errors for unused eslint-disable directives'
            },
            {
              key:'--print-config',
              type: 'path::String',
              description: 'Print the configuration for the given file'
            }
          ]
        }
      }
      meta.generateHelp(params)
    }

    if (options.version || options.v) {
      // version from package.json
      logger.info(`${require("../package.json").version}`);
    } else if (options.printConfig) {
      if (files.length) {
        logger.error("The --print-config option must be used with exactly one file name.");
        return 2;
      }
      if (useStdin) {
        logger.error("The --print-config option is not available for piped-in code.");
        return 2;
      }

      const engine = new Linter(translateOptions(options));
      const fileConfig = engine.getConfigForFile(options.printConfig);

      logger.info(JSON.stringify(fileConfig, null, 2));
      return 0;
    } else if (options.help || options.h || (!files.length && !useStdin)) {
      await showHelp();
    } else {
      if (options.fix && options.fixDryRun) {
        logger.error("The --fix option and the --fix-dry-run option cannot be used together.");
        return 2;
      }
      if (useStdin && options.fix) {
        logger.error("The --fix option is not available for piped-in code; use --fix-dry-run instead.");
        return 2;
      }
      if (options.fixType && !options.fix && !options.fixDryRun) {
        logger.error("The --fix-type option requires either --fix or --fix-dry-run.");
        return 2;
      }
      spinner = logger.spin('Start weex code lint ...')
      
      const engine = new Linter(translateOptions(options));
      const report = useStdin ? engine.executeOnText(text, options.stdinFilename, true) : engine.executeOnFiles(files);
      
      if (options.fix) {
        debug("Fix mode enabled - applying fixes");
        engine.outputFixes(report);
      }
      if (options.quiet) {
        debug("Quiet mode enabled - filtering out warnings");
        report.results = engine.getErrorResults(report.results);
      }
      if (printResults(engine, report.results, options.format, options.outputFile)) {
        const tooManyWarnings = options.maxWarnings >= 0 && report.warningCount > options.maxWarnings;

        if (!report.errorCount && tooManyWarnings) {
          logger.error("ESLint found too many warnings (maximum: %s).", options.maxWarnings);
        }

        return (report.errorCount || tooManyWarnings) ? 1 : 0;
      }
      return 2;
    }
  }
}