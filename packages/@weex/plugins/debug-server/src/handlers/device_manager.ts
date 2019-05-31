import { Router } from '@weex-cli/linker'
import { Device } from '../managers/DeviceManager'
import { Config } from '../ConfigResolver'

const debuggerRouter = Router.get(`debugger-${Config.get('channelId')}`)

debuggerRouter.on(Router.Event.TERMINAL_LEAVED, 'proxy.native', signal => {
  const device = Device.getDevice(signal.channelId)
  if (!device) {
    return
  }
  // need to be fix
  // cause the old version of android devtool sdk will sending disconnect message after the second connect
  // make sure the android device not be removed
  if (device.platform === 'iOS') {
    Device.removeDevice(signal.channelId, async () => {
      await debuggerRouter.pushMessageByChannelId('page.debugger', signal.channelId, {
        method: 'WxDebug.deviceDisconnect',
        params: device,
      })
    })
  }
})

debuggerRouter.on(Router.Event.TERMINAL_JOINED, 'page.debugger', async signal => {
  const device = Device.getDevice(signal.channelId)
  await debuggerRouter.pushMessageByChannelId('page.debugger', signal.channelId, {
    method: 'WxDebug.pushDebuggerInfo',
    params: {
      device,
      bundles: Config.get('BUNDLE_URLS') || [],
    },
  })
})

debuggerRouter
  .registerHandler(message => {
    const device = Device.registerDevice(message.payload.params, message.channelId)
    if (device) {
      message.payload = {
        method: 'WxDebug.pushDebuggerInfo',
        params: {
          device,
          bundles: Config.get('BUNDLE_URLS') || [],
        },
      }
      debuggerRouter.pushMessage('page.entry', {
        method: 'WxDebug.startDebugger',
        params: message.channelId,
      })
      message.to('page.debugger')
    }
    return false
  })
  .at('proxy.native')
  .when('payload.method=="WxDebug.registerDevice"')
