const mlink = require('../index')
const Router = mlink.Router
const debuggerRouter = Router.get('debugger')
const DeviceManager = require('../managers/device_manager')
const config = require('../../config')
const MemoryFile = require('../../MemoryFile')
const uuidv1 = require('uuid/v1')

debuggerRouter
  .registerHandler((message, next) => {
    const payload = message.payload
    const method = payload.method
    const domain = method.split('.')[0]
    const device = DeviceManager.getDevice(message.channelId)
    if (!device) {
      message.discard = true
      return
    }
    if (domain === 'WxDebug') {
      if (method === 'WxDebug.setLogLevel') {
        device.logLevel = payload.params.data
        debuggerRouter.pushMessage('runtime.worker', message.terminalId, {
          method: 'WxDebug.setLogLevel',
          params: {
            logLevel: payload.params.data
          }
        })
      }
      else if (method === 'WxDebug.setElementMode') {
        device.elementMode = payload.params.data
        message.payload = {
          method: 'WxDebug.setElementMode',
          params: {
            mode: payload.params.data
          }
        }
        debuggerRouter.pushMessage('page.debugger', message.terminalId, {
          method: 'WxDebug.reloadInspector'
        })
        debuggerRouter.pushMessage('page.debugger', message.terminalId, {
          method: 'WxDebug.reloadRuntime'
        })
      }
      else if (method === 'WxDebug.network') {
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
      else if (method === 'WxDebug.enable') {
        device && (device.remoteDebug = true)
      }
      else if (method === 'WxDebug.disable') {
        device && (device.remoteDebug = false)
        debuggerRouter.pushMessage('page.debugger', message.terminalId, {
          method: 'WxDebug.reloadInspector'
        })
      }
      else if (method === 'WxDebug.setContextEnvironment') {
        if (!config.env[payload.params.channelId]) {
          config.env[payload.params.channelId] = {}
        }
        if (!config.env[payload.params.channelId]['polify']) {
          config.env[payload.params.channelId]['polify'] = {
            jsframework: '',
            jsservice: [],
            dependencejs: '',
            sourcejs: ''
          }
        }
        config.env[payload.params.channelId]['polify']['jsframework'] =
          payload.params['jsframework']
        if (payload.params['jsservice']) {
          config.env[payload.params.channelId]['polify']['jsservice'] = payload.params['jsservice'].split(',')
        }

        config.env[payload.params.channelId]['polify']['dependencejs'] =
          payload.params['dependencejs']
        config.env[payload.params.channelId]['polify']['workerjs'] =
          payload.params['workerjs']
        config.env[payload.params.channelId]['polify']['sourcejs'] =
          payload.params['sourcejs']
        message.discard()
      }
      else if (method === 'WxDebug.postTemplateFile') {
        let templateFile = new MemoryFile(
          `${uuidv1()}.js`,
          payload.params.value
        ).getUrl()
        debuggerRouter.pushMessage('page.debugger', message.terminalId, {
          method: 'WxDebug.getTemplateFile',
          params: {
            value: templateFile
          }
        })
        message.discard()
      }
    }
    message.to('proxy.native')
  })
  .at('page.debugger')
