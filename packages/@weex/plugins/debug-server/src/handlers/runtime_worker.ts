import { Router, Hub, Message } from '@weex-cli/linker'
import { Runtime } from '../managers/RuntimeManager'
import { Device } from '../managers/DeviceManager'
import { Config } from '../ConfigResolver'

import * as DEBUG from 'debug'
const debug = DEBUG('handler debugger')

const debuggerRouter = Router.get(`debugger-${Config.get('channelId')}`)
const runtimeProxyHub = Hub.get('runtime.proxy')

debuggerRouter
  .registerHandler((message: Message) => {
    message.to('proxy.native')
  })
  .at('sync.native')

debuggerRouter
  .registerHandler((message: Message) => {
    message.to('runtime.worker')
  })
  .at('sync.v8')

debuggerRouter
  .registerHandler((message: Message) => {
    const payload = message.payload
    const method = payload.method
    if (method === 'syncReturn') {
      message.payload = {
        ret: payload.params.ret,
        id: payload.params.syncId,
      }
      message.to('sync.v8')
    } else {
      message.to('proxy.native')
    }
  })
  .at('runtime.worker')

debuggerRouter.on(Router.Event.TERMINAL_JOINED, 'runtime.worker', async signal => {
  let terminal
  try {
    terminal = await Runtime.connect(signal.channelId)
  } catch (error) {
    debug(`Runtime.connect error: ${error}`)
  }
  if (terminal) {
    runtimeProxyHub.join(terminal)
    const device = Device.getDevice(signal.channelId)
    if (device) {
      if (device.remoteDebug === true) {
        await debuggerRouter.pushMessageByChannelId('proxy.native', signal.channelId, {
          method: 'WxDebug.reload',
        })
      }
      debug(`device info: ${JSON.stringify(device)}`)
    } else {
      debug(`device with channelId[${signal.channelId}] is not found`)
    }
  }
})
