import { Router, Message } from '@weex-cli/linker'
import { Config } from '../ConfigResolver'

import * as DEBUG from 'debug'
const debug = DEBUG('Handler:Runtime.Proxy')

const debuggerRouter = Router.get(`debugger-${Config.get('channelId')}`)

let heartbeatTimer
const sendHeartbeat = () => {
  heartbeatTimer && clearTimeout(heartbeatTimer)
  heartbeatTimer = setTimeout(() => {
    debuggerRouter.pushMessage('runtime.proxy', 'ping')
    debug('ping-pong')
    sendHeartbeat()
  }, Config.get('heartbeatTime') || 30000)
}

debuggerRouter
  .registerHandler((message: Message) => {
    const payload = message.payload
    sendHeartbeat()
    if (
      payload.method === 'Debugger.scriptParsed' ||
      (payload.result && payload.result.frameTree) ||
      (payload.params && /\/syncCallNative/.test(payload.params.message))
    ) {
      message.discard()
    }
    message.to('proxy.inspector')
  })
  .at('runtime.proxy')
