const {
  Linter
} = require('../lib')
const debug = require('debug')('lint')

module.exports = {
  name: 'lint',
  description: 'Lint codes and generate code report',
  run: async ({
    logger,
    parameters,
    inquirer
  }) => {
    const files = parameters.array
    const options = parameters.options
    const useStdin = typeof text === "string";
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
      let usageTableData = [
        [logger.colors.green('Synopsis'), logger.colors.green('Usage')],
        ['$ weex lint', 'Lint weex code'],
      ]
      let Options = [
        [logger.colors.green('Basic configuration:'), ''],
        ['-c, --config path::String', 'Use configuration from this file or shareable config'],
        ['--no-eslintrc', 'Disable use of configuration from .eslintrc - default: true'],
        ['--env [String]', 'Specify environments'],
        ['--ext [String]', 'Specify JavaScript file extensions - default: [.js, .vue]'],
        ['--global [String]', 'Define global variables'],
        ['--parser String', 'Specify the parser to be used'],
        ['--parser-options Object', 'Specify parser options'],           
        [logger.colors.green('Caching:'), ''],
        ['--cache','Only check changed files - default: false'],             
        ['--cache-file path::String','Path to the cache file. Deprecated: use --cache-location - default: .eslintcache'],             
        ['--cache-location path::String','Path to the cache file or directory'],
        [logger.colors.green('Handling warnings:'), ''],
        ['--quiet', 'Report errors only - default: false'],
        ['-f, --format String', 'Use a specific output format - default:stylish'],
        ['--color, --no-color', 'Force enabling/disabling of color'],    
        [logger.colors.green('Ignoring files:'), ''],
        ['-ignore-path path::String', 'Specify path of ignore file'],
        ['--no-ignore', 'Disable use of ignore files and patterns'],         
        ['--ignore-pattern [String]', 'Pattern of files to ignore (in addition to those in .eslintignore)'],
        [logger.colors.green('Specifying rules and plugins:'), ''],
        ['-rulesdir [path::String]', 'Use additional rules from this directory'],
        ['--plugin [String]', 'Specify plugins'],
        ['--rule Object', 'Specify rules'],
        [logger.colors.green('Miscellaneous:'), ''],
        ['-v, --version', 'Output the version number'],
        ['-h, --help', 'Show help'],
        ['--fix', 'Automatically fix problems'],
        ['--fix-dry-run', 'Automatically fix problems without saving the changes to the file system'],
        ['--no-inline-config', 'Prevent comments from changing config or rules'],
        ['--report-unused-disable-directives', 'Adds reported errors for unused eslint-disable directives'],
        ['--print-config path::String', 'Print the configuration for the given file']
      ]

      logger.success('\n# weex lint\n')
      logger.table(usageTableData, {
        format: 'markdown'
      })
      logger.info('\nRun the lint script to check if your code has a problem')
      logger.success('\n# Options\n')
      logger.table(Options, {
      })
      logger.info(`\nThis script has alias(c), you can run it like \`weex c [sub-command]\``)
    }

    if (options.version) { // version from package.json

      log.info(`v${require("../package.json").version}`);

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

      logger.info(JSON.stringify(fileConfig, null, "  "));
      return 0;
    } else if (options.help || (!files.length && !useStdin)) {

      showHelp();

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
    // const linter = new Linter(translateOptions(options))
    // const report = linter.verifyFiles([files])

    // console.log(report.results[0].messages[0].message)
  }
}