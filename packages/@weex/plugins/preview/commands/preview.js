const path = require("path");
const detect = require('detect-port');
const ip = require('ip').address();
const { Previewer } = require('../lib');

module.exports = {
  name: "preview",
  description: "Preview weex page",
  alias: "p",
  run: async (
    {
      logger,
      parameters,
      inquirer,
      meta,
      compile,
      chromeOpn
    }
  ) => {
    const options = parameters.options;
    const source = parameters.first;
    const array = parameters.array;
    let preview = null;
    let previewOptions = {};

    const showHelp = async () => {
      let params = {
        commandend: 'Preview weex page',
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

    const afterComileWeexBundle = async (error, output, json) => {
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
        const pages = json.chunks.map(chunk => {
          return chunk.files[0]
        })
        await compile(
          source,
        `${preview.defaultFrontendLocation}/dist`,
          {
            watch: true,
            filename: '[name].web.js',
            web: true,
            config: options.config || options.c
          },
          async (error, output, json) => {
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
              // logger.log(`Time:${json.time}ms`);
              await compile(
                source,
                `${preview.defaultFrontendLocation}/dist`,
                {
                  config: options.config || options.c
                },
                async () => {
                  await preview.hotReloadServer.sendSocketMessage()
                }
              );
            }
          }
        )
        let previewUrl = ''
        if (json.isSigleWebRender) {
          previewUrl = encodeURI(`http://${ip}:${previewOptions.port}?entry=${previewOptions.entry || pages[0]}&wsport=${previewOptions.wsport}&pages=${JSON.stringify(pages)}&preview=single`)
        } else {
          previewUrl = encodeURI(`http://${ip}:${previewOptions.port}?entry=${previewOptions.entry || pages[0]}&wsport=${previewOptions.wsport}&pages=${JSON.stringify(pages)}`)
        }
        logger.log(`Preview your page on ${logger.colors.yellow(previewUrl)}`)
        chromeOpn(previewUrl, null, false)
      }
    }

    if (array.length >= 1) {
      previewOptions = await translateOptions(options)
      preview = new Previewer(previewOptions)
      await compile(
        source,
        `${preview.defaultFrontendLocation}/dist`,
        {
          config: options.config || options.c
        },
        afterComileWeexBundle
      );
    } else if (array.length < 1) {
      await showHelp()
    }
  }
};
