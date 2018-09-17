const devtool = require('../index')
const ip = require('ip').address()
const exit = require('exit')

module.exports = {
  name: 'debug',
  description: 'Debug weex bundle',
  alias: 'd',
  run: async context => {
    // tools
    const logger = context.logger
    const WebSocket = context.ws
    const staticService = context.staticService
    const opn = context.opn
    const headless = context.headless
    // params
    // TODO: detact port
    const remoteDebugPort = 9228
    const port = 8099

    const devtoolOptions = {
      ip: ip,
      port: port,
      remoteDebugPort: remoteDebugPort,
      // need to put the runtime.html into the same http server
      staticSource: staticService.getSourceLocation()
    }

    const entry = await devtool.start(devtoolOptions)

    // socket to control debugger status.
    // should be use after device has been connected.
    // use to control debugger.
    const debuggerProxyUrl = entry.debuggerProxyUrl
    // socket to control native
    const nativeProxyUrl = entry.nativeProxyUrl
    // socket to control inspector
    const inspectorProxyUrl = entry.inspectorProxyUrl
    // url need to be lanuch on chrome or chromium with debug mode.
    const runtiemUrl = entry.runtimeUrl
    // socket id
    // const channelId = entry.channelId
    // chrome devtool socket need to remove ws://
    const chromeDevtoolUrl = inspectorProxyUrl.replace('ws://', '')

    await headless.launchHeadless(runtiemUrl, {
      remoteDebugPort: remoteDebugPort
    })

    const debuggerWs = new WebSocket(debuggerProxyUrl)

    debuggerWs.on('message', message => {
      const msg = JSON.parse(message)
      if (msg.method === 'WxDebug.startDebugger') {
        console.log(
          'Inspector Connection Url: %s',
          `http://${ip}:${port}/${staticService.getInspectorReleactivePath()}?ws=${chromeDevtoolUrl}`
        )
        opn(
          `http://${ip}:${port}/${staticService.getInspectorReleactivePath()}?ws=${chromeDevtoolUrl}`
        )
      }
    })

    process.on('SIGINT', () => {
      headless.closeHeadless()
      exit(0)
    })

    logger.log(
      `Connecting Url: http://${ip}:${port}/fake.html?_wx_devtool=${nativeProxyUrl}`
    )
  }
}
