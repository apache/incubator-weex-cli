const path = require("path");
const detect = require('detect-port');
const ip = require('ip').address();
const pkg = require('../package.json');

const {
  Previewer
} = require('../lib');

module.exports = {
  name: "preview",
  description: "Preview weex page",
  alias: "p",
  run: async ({
    logger,
    parameters,
    inquirer,
    meta,
    compile,
    chromeOpn
  }) => {
    const options = parameters.options;
    const source = parameters.first;
    const array = parameters.array;
    let preview = null;
    let previewOptions = {};
    let spinner

    const showHelp = async () => {
      let params = {
        commandend: 'Preview weex page',
        commands: [{
            heading: ['Usage', 'Description']
          },
          {
            key: 'preview',
            type: '[source] --entry [filename]',
            description: 'Preview weex pages on floder'
          }
        ],
        options: {
          'Base': [{
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
          'Miscellaneous:': [{
              key: '-v, --version',
              description: 'Output the version number'
            },
            {  
              key: '-h, --help',
              description: 'Show help'
            }
          ]
        }
      }
      meta.generateHelp(params)
    }

    const translateOptions = async (cliOptions) => {
      let port = cliOptions.port || 8080
      let _port = await detect(port)
      if (port !== _port) {
        logger.info(`The port ${logger.colors.yellow(port)} is already occupied, use ${logger.colors.yellow(_port)} as the port number`)
      }
      return {
        port: _port,
        wsport: _port + 1,
        entry: cliOptions.entry,
      }
    }

    const translateCompileOptions = (cliOptions) => {
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

    const formateResult = (error, output, json) => {
      if (error) {
        logger.error(`${logger.xmark} Build failed, please check the error below:`);
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

    const outputCompileError = (error) => {
      logger.error(`${logger.xmark} Build failed, please check the error below:`);
      if (Array.isArray(error)) {
        error.forEach(e => {
          logger.error(e.replace("/n", "\n"));
        });
      } else if (error.stack) {
        logger.error(error.stack.replace("/n", "\n"));
      } else {
        logger.error(error.replace("/n", "\n"));
      }
    }
    
    const postComileWeexBundle = async (error, output, json) => {
      if (error) {
        outputCompileError(error)
      } else {
        const pages = json.chunks.map(chunk => {
          return chunk.files[0]
        })

        let previewUrl = ''
        
        if (!previewOptions.entry) {
          previewOptions.entry = pages[0]
        }

        if (json.isSigleWebRender) {
          previewUrl = encodeURI(`http://${ip}:${previewOptions.port}?entry=${previewOptions.entry.replace('.vue', '.js') || pages[0]}&wsport=${previewOptions.wsport}&pages=${JSON.stringify(pages)}&preview=single`)
        } else {
          previewUrl = encodeURI(`http://${ip}:${previewOptions.port}?entry=${previewOptions.entry.replace('.vue', '.js') || pages[0]}&wsport=${previewOptions.wsport}&pages=${JSON.stringify(pages)}`)
        }
        chromeOpn(previewUrl, null, false)
        logger.log('\nIf your browser does not open automatically, you can click on the link below:')
        logger.warn(previewUrl)
        logger.log('\n----------------------------')


        spinner = logger.spin('[Web] Compiling bundle ...')
        // compile web with watch mode
        await compile(
          source,
          `${preview.defaultFrontendLocation}/dist`,
          Object.assign({
            onProgress: (complete, action) => {
              if (complete >= 1) {
                spinner.stopAndPersist({
                  symbol: logger.colors.green(logger.checkmark),
                  text: `${logger.colors.grey(`[Web] Complete ${json.time} ms`)}`
                })
              } else {
                spinner.text = `[${(complete * 100).toFixed(0)}%] Compiling web bundle ...`
              }
            }
          }, {
            watch: true,
            filename: '[name].web.js',
            web: true,
            config: options.config || options.c
          }),
          async (error, output, json) => {
            if (error) {
              outputCompileError(error)
            } else {
              spinner = logger.spin('[Native] Compiling bundle ...')
              await compile(
                source,
                `${preview.defaultFrontendLocation}/dist`,
                Object.assign({
                  onProgress: (complete, action) => {
                    if (complete >= 1) {
                      spinner.stopAndPersist({
                        symbol: logger.colors.green(logger.checkmark),
                        text: `${logger.colors.grey(`[Native] Complete ${json.time} ms`)}`
                      })
                    } else {
                      spinner.text = `[${(complete * 100).toFixed(0)}%] Compiling native bundle ...`
                    }
                  }
                }, translateCompileOptions(options)),
                async (error, output, json) => {
                  if (error) {
                    outputCompileError(error)
                  } else {
                    await preview.hotReloadServer.sendSocketMessage()
                  }
                }
              );
            }
          }
        )
      }
    }
    if (options.help || options.h) {
      await showHelp()
    } else if (options.version || options.v) {
      console.log(pkg.version)
    } else if (array.length >= 1) {
      previewOptions = await translateOptions(options)
      preview = new Previewer(previewOptions)
      await compile(
        source,
        `${preview.defaultFrontendLocation}/dist`,
        translateCompileOptions(options),
        postComileWeexBundle
      );
    } else if (array.length < 1) {
      await showHelp()
    }
  }
};
