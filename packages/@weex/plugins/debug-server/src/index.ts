import Devtool from './Devtool'
import debugServer from './server'
import ConfigResolver from './ConfigResolver'
import * as ip from 'ip'
import * as uuid from 'uuid'

const startServer = async port => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await debugServer.start(port)
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

export const start = async (options: any) => {
  if (!options.port) {
    options.port = '8888'
  }
  if (!options.ip) {
    options.ip = ip.address()
  }
  if (!options.channelId) {
    options.channelId = uuid()
  }
  if (!options.remoteDebugPort) {
    options.remoteDebugPort = '9222'
  }
  const Config = new ConfigResolver(options)
  const origin = `ws://${Config.get('ip')}:${Config.get('port')}`
  const result: any = await startServer(Config.get('port'))
  const socket = {
    entry: `${origin}/page/entry/${Config.get('channelId') || ''}`,
    native: `${origin}/debugProxy/native/${Config.get('channelId') || ''}`,
    debugger: `${origin}/debugProxy/debugger/${Config.get('channelId') || ''}`,
    inspector: `${origin}/debugProxy/inspector/${Config.get('channelId') || ''}`,
    runtime: `${origin}/debugProxy/runtime/${Config.get('channelId') || ''}`,
  }
  const runtime = `http://${Config.get('ip')}:${Config.get('port')}/runtime.html`
  return new Devtool(result.server, socket, runtime, result.event)
}

export { default as Devtool } from './Devtool'

export default {
  start,
  Devtool,
}
