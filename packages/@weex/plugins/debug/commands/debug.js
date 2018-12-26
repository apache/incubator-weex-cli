const {
  api
} = require('../index')
const ip = require('ip').address()
const exit = require('exit')
const path = require('path')
const detect = require('detect-port')

module.exports = {
  name: 'debug',
  description: 'Debug weex bundle',
  alias: 'd',
  run: async ({
    logger,
    parameters,
    compile
  }) => {
    const options = parameters.options
    const source = parameters.first

    const transformOptions = async (options) => {
      let defaultPort = await detect(8089)
      return {
        port: options.port || defaultPort,
        channelId: options.channelid,
        manual: options.manual,
        remoteDebugPort: options.remoteDebugPort
      }
    }

    let devtoolOptions = await transformOptions(options)

    if (source) {
      await compile(
        source,
        path.join(__dirname, '../frontend/public/weex'), {
          watch: false,
          filename: '[name].js',
          web: false,
          config: options.config || options.c
        },
        async (error, output, json) => {
          
          // console.log(json)
          let bundles = json.assets.map(asset => {
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
              output: `http://${ip}:${devtoolOptions.port}/weex/${asset.name}`,
              size: (asset.size / 1024).toFixed(0),
              time: json.time,
              entry: entry
            }
          })
          await api.startDevtoolServer(bundles, devtoolOptions)
        }
      )
    } else {
      await api.startDevtoolServer([], devtoolOptions)
    }

  }
}