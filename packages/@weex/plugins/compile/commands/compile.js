const path = require("path");
const pkg = require('../package.json')

module.exports = {
  name: "compile",
  description: "Compile weex bundle",
  alias: "c",
  run: async (
    {
      logger,
      parameters,
      inquirer,
      meta,
      compile
    }
  ) => {
    const options = parameters.options;
    const source = parameters.first;
    const target = parameters.second;
    const array = parameters.array;
    const analyzer = parameters.options.__analyzer
    let progressBar;

    const showHelp = async () => {
      let params = {
        commandend: 'Compile JS/Vue to Weex bundle',
        commands: [
          {
            heading: ['Usage', 'Description']
          },
          {
            key: 'compile',
            type: '[source] [target] --<options>',
            description: 'Compile from source floder to target floder.'
          },
          {
            key: 'compile',
            type: '[filename.vue] [floder | path/filename.js]',
            description: 'Compile specify file to floder or a specify file.'
          }
        ],
        options: {
          'Base': [
            {
              key: '-e,--ext',
              type: '[ext]',
              description: 'set default extname for compiler',
              default: '[\'vue\', \'js\']'
            },
            {
              key: '--web',
              description: 'compile for web render',
            },
            {
              key: '-w,--watch',
              description: 'compile with watch mode'
            },
            {
              key: '-d,--devtool',
              type: '[devtool]',
              description: 'set webpack devtool mode'
            },
            {
              key: '-m,--min',
              description: 'uglify the output js content'
            },
            {
              key: '-c,--config',
              type: '[path]',
              description: 'compile with specify webpack config file'
            },
            {
              key: '-b,--base',
              type: '[path]',
              description: 'set the base path of source'
            }
          ],
          'Miscellaneous:': [
            {
              key:'-v, --version',
              description: 'Output the version number'
            },
            {
              key:'-h, --help',
              description: 'Show help'
            }
          ]
        }
      }
      meta.generateHelp(params)
    }

    const translateOptions = (cliOptions) => {
      return {
        watch: cliOptions.watch || cliOptions.w,
        devtool: cliOptions.devtool || cliOptions.d,
        ext: path.extname(source) || cliOptions.ext || cliOptions.e || "vue|we",
        web: cliOptions.web || cliOptions.w,
        min: cliOptions.min || cliOptions.m,
        config: cliOptions.config || cliOptions.c,
        base: cliOptions.base || cliOptions.b,
        outputConfig: cliOptions.outputConfig,
        prod: cliOptions.prod
      }
    }

    const formateResult = async (error, output, json) => {
      progressBar.hide();
      if (error) {
        await analyzer('compile', Array.isArray(error)?error.join('\n'):error)
        // logger.error(`${logger.xmark} Build failed, please check the error below:`);
        // if (Array.isArray(error)) {
        //   error.forEach(e => {
        //     logger.error(e.replace("/n", "\n"));
        //   });
        // } else if (error.stack) {
        //   logger.error(error.stack.replace("/n", "\n"));
        // } else {
        //   logger.error(error.replace("/n", "\n"));
        // }
      } else {
        logger.log(output.toString());
      }
    }

    if (options.help || options.h) {
      await showHelp()
    } else if (array.length < 2) {
      await showHelp()
    }  else if (options.v || options.version) {
      logger.log(pkg.version)
    } else if (array.length >= 2) {
      progressBar = logger.progress();
      let maxProgress = 0;
      await compile(
        source,
        target,
        Object.assign({
          onProgress: function(complete, action) {
            if (complete > maxProgress) {
              maxProgress = complete;
            } else {
              complete = maxProgress;
            }
            progressBar.show(action, complete);
          }
        }, translateOptions(options)),
        formateResult
      );
    } 
  }
};
