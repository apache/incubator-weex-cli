const mlink = require('../index')
const Router = mlink.Router
const Logger = mlink.Logger
const Hub = mlink.Hub
const debuggerRouter = Router.get('debugger')
const DeviceManager = require('../managers/device_manager')
const RuntimeManager = require('../managers/runtime_manager')
const runtimeProxyHub = Hub.get('runtime.proxy')

debuggerRouter
  .registerHandler(function (message) {
    message.to('proxy.native')
  })
  .at('sync.native')

debuggerRouter
  .registerHandler(function (message) {
    message.to('runtime.worker')
  })
  .at('sync.v8')

debuggerRouter
  .registerHandler(function (message) {
    const payload = message.payload
    if (payload.method === 'syncReturn') {
      message.payload = {
        ret: payload.params.ret,
        id: payload.params.syncId
      }
      message.to('sync.v8')
    }
    else {
      message.to('proxy.native')
    }
  })
  .at('runtime.worker')

debuggerRouter.on(Router.Event.TERMINAL_JOINED, 'runtime.worker', function (
  signal
) {
  RuntimeManager.connect(signal.channelId).then(
    function (terminal) {
      runtimeProxyHub.join(terminal)
      const device = DeviceManager.getDevice(signal.channelId)
      if (device) {
        if (device.remoteDebug === true) {
          debuggerRouter.pushMessageByChannelId(
            'proxy.native',
            signal.channelId,
            {
              method: 'WxDebug.reload'
            }
          )
        }
      }
      else {
        Logger.error(
          'device with channelId[' + signal.channelId + '] is not found'
        )
      }
    },
    errorText => {
      debuggerRouter.pushMessageByChannelId('page.debugger', signal.channelId, {
        method: 'WxDebug.prompt',
        params: {
          messageText: errorText
        }
      })
    }
  )
})

debuggerRouter.on(Router.Event.TERMINAL_LEAVED, 'runtime.worker', function (
  signal
) {
  if (RuntimeManager.has(signal.channelId)) {
    RuntimeManager.remove(signal.channelId)
  }
})
