const path = require("path");

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

    if (array.length >= 2) {
      const progressBar = logger.progress();
      let maxProgress = 0;
      await compile(
        source,
        target,
        {
          onProgress: function(complete, action) {
            if (complete > maxProgress) {
              maxProgress = complete;
            } else {
              complete = maxProgress;
            }
            progressBar.show(action, complete);
          },
          watch: options.watch || options.w,
          devtool: options.devtool || options.d,
          ext: path.extname(source) || options.ext || options.e || "vue|we",
          web: options.web || options.w,
          min: options.min || options.m,
          config: options.config || options.c,
          base: options.base || options.b
        },
        (error, output, json) => {
          progressBar.hide();
          if (error) {
            logger.error("Build Failed!");
            if (Array.isArray(error)) {
              error.forEach(e => {
                logger.error(e.replace("/n", "\n"));
              });
            } else if (error.stack) {
              logger.error(error.stack.replace("/n", "\n"));
            } else {
              logger.error(error.replace("/n", "\n"));
            }
          } else {
            logger.log(output.toString());
          }
        }
      );
    } else if (array.length < 2) {
      await showHelp()
    }
  }
};
