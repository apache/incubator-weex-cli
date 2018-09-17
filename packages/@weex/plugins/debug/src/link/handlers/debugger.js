const mlink = require('../index')
const Router = mlink.Router
const debuggerRouter = Router.get('debugger')
const DeviceManager = require('../managers/device_manager')

debuggerRouter
  .registerHandler(function (message, next) {
    const payload = message.payload
    const device = DeviceManager.getDevice(message.channelId)
    if (!device) {
      message.discard = true
      return
    }
    if (payload.method === 'WxDebug.setLogLevel') {
      device.logLevel = payload.params.data
      message.payload = {
        method: 'WxDebug.setLogLevel',
        params: {
          logLevel: payload.params.data
        }
      }
      debuggerRouter.pushMessage('page.debugger', message.terminalId, {
        method: 'WxDebug.reloadInspector'
      })
      debuggerRouter.pushMessage('page.debugger', message.terminalId, {
        method: 'WxDebug.reloadRuntime'
      })
    }
    else if (payload.method === 'WxDebug.setElementMode') {
      device.elementMode = payload.params.data
      message.payload = {
        method: 'WxDebug.setElementMode',
        params: {
          mode: payload.params.data
        }
      }
      // setTimeout(function(){})
      debuggerRouter.pushMessage('page.debugger', message.terminalId, {
        method: 'WxDebug.reloadInspector'
      })
      debuggerRouter.pushMessage('page.debugger', message.terminalId, {
        method: 'WxDebug.reloadRuntime'
      })
    }
    else if (payload.method === 'WxDebug.network') {
      device && (device.network = payload.params.enable)
      message.payload = {
        method: 'WxDebug.network',
        params: {
          enable: payload.params.enable
        }
      }
      debuggerRouter.pushMessage('page.debugger', message.terminalId, {
        method: 'WxDebug.reloadInspector'
      })
      debuggerRouter.pushMessage('page.debugger', message.terminalId, {
        method: 'WxDebug.reloadRuntime'
      })
    }
    else if (payload.method === 'WxDebug.enable') {
      device && (device.remoteDebug = true)
    }
    else if (payload.method === 'WxDebug.disable') {
      device && (device.remoteDebug = false)
      debuggerRouter.pushMessage('page.debugger', message.terminalId, {
        method: 'WxDebug.reloadInspector'
      })
    }
    message.to('proxy.native')
  })
  .at('page.debugger')
