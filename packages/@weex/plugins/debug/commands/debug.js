const {
  api
} = require('../index')
const ip = require('ip').address()
const exit = require('exit')
const path = require('path')
const uuid = require('uuid')
const detect = require('detect-port')
const pkg = require('../package.json')

module.exports = {
  name: 'debug',
  description: 'Debug weex bundle',
  alias: 'd',
  run: async ({
    logger,
    parameters,
    compile,
    meta
  }) => {
    const options = parameters.options
    const source = parameters.first
    const analyzer = options.__analyzer
    
    const showHelp = async () => {
      let params = {
        commandend: 'Debug Weex page, also can compile some \`.vue\` page',
        commands: [
          {
            heading: ['Usage', 'Description']
          },
          {
            key: 'debug',
            type: '',
            description: 'Just open the devtool server.'
          },
          {
            key: 'debug',
            type: '[source] --<options>',
            description: 'Compile source then open devtool server.'
          }
        ],
        options: {
          'Base': [
            {
              key: '-p, --port',
              description: 'set default extname for compiler',
              default: '8080'
            },
            {
              key: '--host',
              description: 'specify host adress',
            },
            {
              key: '--channelid',
              description: 'specify debug channel id'
            },
            {
              key: '--manual',
              default: 'false',
              description: 'control open browser or not'
            },
            {
              key: '--remote-debug-port',
              description: 'specify remote debug port for headless chromium',
              default: '9222'
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
            }
          ]
        }
      }
      meta.generateHelp(params)
    }

    const transformOptions = async (options) => {
      let defaultPort = await detect(8089)
      return {
        ip: options.host,
        port: options.port || options.p || defaultPort,
        channelId: options.channelid || uuid(),
        manual: options.manual,
        remoteDebugPort: options.remoteDebugPort
      }
    }

    let devtoolOptions = await transformOptions(options)
    let shouldReload = false
    if (options.help || options.h) {
      await showHelp()
    } else if (options.v || options.version) {
      logger.log(pkg.version)
    } else {
      if (source) {
        await compile(
          source,
          path.join(__dirname, '../frontend/public/weex'), {
            watch: true,
            filename: '[name].js',
            web: false,
            config: options.config || options.c
          },
          async (error, output, json) => {
            let bundles = []
            if (error) {
              await analyzer('compile', Array.isArray(error)?error.join('\n'):error)
            }
            else {
              bundles = json.assets.map(asset => {
                let entry 
                let date = new Date()
                const formateTime = (value) => {
                  return value < 10 ? '0' + value : value
                }
                if (/\./.test(source)) {
                  entry = path.resolve(source)
                } else {
                  entry = path.resolve(source, asset.name.replace('.js', '.vue'))
                }
                return {
                  updateTime: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()} ${formateTime(date.getHours())}:${formateTime(date.getMinutes())}:${formateTime(date.getSeconds())}`,
                  output: `http://${ip}:${devtoolOptions.port}/weex/${asset.name}?bundleType=vue`,
                  size: (asset.size / 1024).toFixed(0),
                  time: json.time,
                  entry: entry
                }
              })
            }
            if (!shouldReload) {
              shouldReload = true
              await api.startDevtoolServer(bundles, devtoolOptions)
            } else {
              api.reload()
            }
          }
        )
      } else {
        await api.startDevtoolServer([], devtoolOptions)
      }
    }
  }
}