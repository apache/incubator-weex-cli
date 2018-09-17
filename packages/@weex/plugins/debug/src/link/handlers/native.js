const mlink = require('../index')
const Router = mlink.Router
const DeviceManager = require('../managers/device_manager')
const config = require('../../config')
const {
  bundleWrapper,
  transformUrlToLocalUrl,
  generateSandboxWorkerEntry,
  generateWorkerEntry,
  pickDomain
} = require('../../util/wrapper')
const MemoryFile = require('../../MemoryFile')
const debuggerRouter = Router.get('debugger')
const crypto = require('../../util/crypto')
const path = require('path')
const env = {}
debuggerRouter
  .registerHandler(function (message) {
    const payload = message.payload
    const device = DeviceManager.getDevice(message.channelId)
    if (!env[message.channelId]) {
      env[message.channelId] = {}
    }
    if (payload.method === 'WxDebug.initJSRuntime') {
      env[message.channelId]['jsframework'] = new MemoryFile(
        'js-framework.js',
        payload.params.source
      ).getUrl()
      if (device && device.logLevel) {
        payload.params.env.WXEnvironment.logLevel = device.logLevel
      }
      env[message.channelId]['isLayoutAndSandbox'] =
        payload.params.isLayoutAndSandbox
    }
    else if (
      payload.method === 'WxDebug.callJS' &&
      payload.params.method === 'createInstance'
    ) {
      const code = payload.params.args[1]
      const bundleUrl =
        payload.params.args[2].bundleUrl || crypto.md5(code) + '.js'
      env[message.channelId]['sourceUrl'] = new MemoryFile(
        bundleUrl,
        bundleWrapper(code, transformUrlToLocalUrl(bundleUrl))
      ).getUrl()
      payload.params.sourceUrl = env[message.channelId]['sourceUrl']
      payload.params.workerjs = new MemoryFile(
        `[Runtime]-${path.basename(bundleUrl)}`,
        generateWorkerEntry(env[message.channelId])
      ).getUrl()
      if (env[message.channelId] && env[message.channelId]['importScripts']) {
        payload.params.importScripts = env[message.channelId]['importScripts']
      }
      debuggerRouter.pushMessageByChannelId(
        'page.debugger',
        message.channelId,
        {
          method: 'WxDebug.bundleRendered',
          params: {
            bundleUrl: payload.params.args[2].bundleUrl
          }
        }
      )
    }
    else if (
      payload.method === 'WxDebug.callJS' &&
      payload.params.method === 'destroyInstance'
    ) {
      config.ACTIVE_INSTANCEID = ''
    }
    else if (
      payload.method === 'WxDebug.callJS' &&
      payload.params.method === 'createInstanceContext'
    ) {
      const options = payload.params.args[1]
      const dependenceCode = payload.params.args[3]
      config.ACTIVE_INSTANCEID = payload.params.args[0]
      if (dependenceCode) {
        payload.params.dependenceUrl = new MemoryFile(
          `${pickDomain(options.bundleUrl)}/rax-api.js`,
          dependenceCode
        ).getUrl()
      }
      if (env[message.channelId] && env[message.channelId]['importScripts']) {
        payload.params.importScripts = env[message.channelId]['importScripts']
      }
      payload.params.workerjs = new MemoryFile(
        `[Runtime]-${path.basename(options.bundleUrl)}`,
        generateSandboxWorkerEntry(env[message.channelId])
      ).getUrl()
      debuggerRouter.pushMessageByChannelId(
        'page.debugger',
        message.channelId,
        {
          method: 'WxDebug.bundleRendered',
          params: {
            bundleUrl: payload.params.args[2].bundleUrl
          }
        }
      )
    }
    else if (
      payload.method === 'WxDebug.callJS' &&
      payload.params.method === 'importScript'
    ) {
      const code = payload.params.args[1]
      const bundleUrl =
        (payload.params.args[2] && payload.params.args[2].bundleUrl) ||
        crypto.md5(code) + '.js'
      payload.params.sourceUrl = new MemoryFile(bundleUrl, code).getUrl()
    }
    else if (payload.method === 'WxDebug.importScript') {
      const code = payload.params.source
      const url = new MemoryFile(
        `import_${crypto.md5(code)}.js`,
        payload.params.source
      ).getUrl()
      if (!env[message.channelId]['importScripts']) {
        env[message.channelId]['importScripts'] = []
      }
      if (env[message.channelId]['importScripts'].indexOf(url) === -1) {
        env[message.channelId]['importScripts'].push(url)
      }
    }
    else if (payload.method === 'syncReturn') {
      message.payload = {
        error: payload.error,
        ret: payload.params && payload.params.ret
      }
      message.to('sync.native')
      return
    }
    else if (payload.method === 'WxDebug.sendTracingData') {
      message.to('page.debugger')
      return
    }
    else if (payload.method === 'WxDebug.sendSummaryInfo') {
      message.to('page.debugger')
      return
    }
    else if (payload.method === 'WxDebug.sendPerformanceData') {
      message.to('page.debugger')
      return
    }
    message.to('runtime.worker')
  })
  .at('proxy.native')
  .when('payload.method&&payload.method.split(".")[0]==="WxDebug"')

debuggerRouter
  .registerHandler(function (message) {
    const payload = message.payload
    const device = DeviceManager.getDevice(message.channelId)
    if (payload.method === 'Page.screencastFrame') {
      payload.params.sessionId = 1
      if (device && device.platform === 'android') {
        payload.params.metadata.pageScaleFactor = 0.999
      }
    }
    else if (payload.method === 'Console.messageAdded') {
      // issue: https://github.com/weexteam/weex-toolkit/issues/408
      // TODO: make it can be control by user

      // if (LOGLEVEL[payload.params.message.level] >= LOGLEVEL[device && device.logLevel ? device.logLevel : 'debug']) {
      //   message.payload = {
      //     'method': 'Runtime.consoleAPICalled',
      //     'params': {
      //       'type': payload.params.message.level,
      //       'args': [{
      //         type: 'string',
      //         value: payload.params.message.text
      //       }] || [],
      //       'executionContextId': 1
      //       // "stackTrace": payload.params.message.stackTrace
      //     }
      //   };
      // }
      // else {
      //   message.discard();
      // }
      message.discard()
    }
    else if (payload.method === 'DOM.childNodeRemoved') {
      // 此处是为了 扫bundle二维码通知页面关掉bundle二维码界面这个功能
      // 当没有打开JS Debug时 weex加载bundle devtool是不知道的 只能模糊的通过childNodeRemoved判断
      // 这个标记用来限制短时间内发出很多次通知
      const now = new Date().getTime()
      if (!device || now - (device.lastRenderedNotifyTime || 0) > 1500) {
        // 对device不存在的异常做保护
        if (device) device.lastRenderedNotifyTime = now
        if (device && device.platform !== 'iOS') {
          debuggerRouter.pushMessageByChannelId(
            'page.debugger',
            message.channelId,
            {
              method: 'WxDebug.bundleRendered'
            }
          )
        }
      }
    }
    else if (
      payload.result &&
      payload.result.method === 'WxDebug.syncReturn'
    ) {
      message.payload = {
        error: payload.error,
        ret: payload.result.params && payload.result.params.ret
      }
      message.to('sync.native')
      return
    }
    else if (payload.result && payload.id === undefined) {
      message.discard()
    }
    message.to('proxy.inspector')
  })
  .at('proxy.native')
  .when('!payload.method||payload.method.split(".")[0]!=="WxDebug"')
