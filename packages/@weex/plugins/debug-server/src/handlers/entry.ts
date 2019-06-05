import { Router, Message } from '@weex-cli/linker'
import * as opn from 'opn'
import { Config } from '../ConfigResolver'

import * as DEBUG from 'debug'
const debug = DEBUG('Handler:Page.Entry')

const debuggerRouter = Router.get(`debugger-${Config.get('channelId')}`)

let heartbeatTimer
const sendHeartbeat = () => {
  heartbeatTimer && clearTimeout(heartbeatTimer)
  heartbeatTimer = setTimeout(() => {
    debuggerRouter.pushMessage('page.entry', 'ping')
    debug('ping-pong')
    sendHeartbeat()
  }, Config.get('heartbeatTime') || 30000)
}

debuggerRouter
  .registerHandler((message: Message) => {
    let method = message.payload.method
    sendHeartbeat()
    if (method === 'WxDebug.queryServerVersion') {
      let pkg = require('../../package.json')
      debuggerRouter.pushMessage('page.entry', {
        method: 'WxDebug.pushServerVersion',
        params: {
          version: pkg.version,
        },
      })
      message.discard()
    } else if (method === 'WxDebug.openFile') {
      opn(message.payload.params)
    }
  })
  .at('page.entry')
