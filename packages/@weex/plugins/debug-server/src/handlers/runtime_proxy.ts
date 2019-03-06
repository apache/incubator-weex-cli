import { Router, Message } from '@weex-cli/linker'
import { Config } from '../ConfigResolver'

const debuggerRouter = Router.get(`debugger-${Config.get('channelId')}`)

debuggerRouter
  .registerHandler((message: Message) => {
    const payload = message.payload
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
