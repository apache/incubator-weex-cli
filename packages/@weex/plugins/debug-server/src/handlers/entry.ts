import { Router, Message } from '@weex-cli/linker'
import * as opn from 'opn'
import { Config } from '../ConfigResolver'

const debuggerRouter = Router.get(`debugger-${Config.get('channelId')}`)

debuggerRouter
  .registerHandler((message: Message) => {
    let method = message.payload.method
    if (method === 'WxDebug.queryServerVersion') {
      let pkg = require('../../../package.json')
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
