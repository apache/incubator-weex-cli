const mlink = require('../index')
const Router = mlink.Router
const DeviceManager = require('../managers/device_manager')
const config = require('../../config')
const {
  bundleWrapper,
  transformUrlToLocalUrl,
  generateSandboxWorkerEntry,
  generateWorkerEntry
} = require('../../util/wrapper')
const MemoryFile = require('../../MemoryFile')
const debuggerRouter = Router.get('debugger')
const crypto = require('../../util/crypto')
const path = require('path')
config.env = {}

config.wmlEnv = {}

debuggerRouter
  .registerHandler(function (message) {
    const payload = message.payload
    const method = payload.method
    const device = DeviceManager.getDevice(message.channelId)
    if (method === 'WxDebug.initJSRuntime') {
      if (!config.env[message.channelId]) {
        config.env[message.channelId] = {}
      }
      config.env[message.channelId]['jsframework'] = new MemoryFile(
        'js-framework.js',
        payload.params.source
      ).getUrl()
      if (device && device.logLevel) {
        payload.params.env.WXEnvironment.logLevel = device.logLevel
      }
      config.env[message.channelId]['isLayoutAndSandbox'] =
        payload.params.isLayoutAndSandbox
      config.env[message.channelId]['environment'] = payload.params.env
      config.env[message.channelId]['device'] = device
    }
    else if (
      method === 'WxDebug.callJS' &&
      payload.params.method === 'createInstance'
    ) {
      const code = payload.params.args[1]
      let bundleUrl =
        payload.params.args[2].bundleUrl || crypto.md5(code) + '.js'
      let env = {
        environment: config.env[message.channelId]['environment'],
        device: config.env[message.channelId]['device'],
        isLayoutAndSandbox: config.env[message.channelId]['isLayoutAndSandbox']
      }
      if (
        /^(https?|taobao|qap):\/\/(.*your_current_ip):(\d+)\//i.test(bundleUrl)
      ) {
        bundleUrl = bundleUrl.replace(
          /^(https?|taobao|qap):\/\/(.*your_current_ip):(\d+)\//i,
          'file://'
        )
      }
      env['sourceUrl'] = new MemoryFile(
        bundleUrl,
        bundleWrapper(code, transformUrlToLocalUrl(bundleUrl))
      ).getUrl()
      if (
        config.env[message.channelId] &&
        config.env[message.channelId]['polify'] &&
        config.env[message.channelId]['polify']['jsframework']
      ) {
        env['jsframework'] =
          config.env[message.channelId]['polify']['jsframework']
      }
      else {
        env['jsframework'] = config.env[message.channelId]['jsframework']
      }
      config.env[message.channelId]['workerjs'] = payload.params.workerjs = new MemoryFile(
        `[Runtime]/${path.basename(bundleUrl)}`,
        generateWorkerEntry(env)
      ).getUrl()
      if (
        config.env[message.channelId]['polify'] &&
        config.env[message.channelId]['polify']['workerjs']
      ) {
        env['workerjs'] = config.env[message.channelId]['polify']['workerjs']
      }
      else {
        env['workerjs'] = config.env[message.channelId]['workerjs']
      }
      payload.params.workerjs = env['workerjs']
      if (
        config.env[message.channelId]['polify'] &&
        Array.isArray(config.env[message.channelId]['polify']['jsservice']) &&
        config.env[message.channelId]['polify']['jsservice'].length > 0
      ) {
        payload.params.jsservice =
          config.env[message.channelId]['polify']['jsservice']
      }
      else {
        payload.params.jsservice = config.env[message.channelId]['jsservice']
      }
      if (
        config.env[message.channelId] &&
        config.env[message.channelId]['polify'] &&
        config.env[message.channelId]['polify']['sourcejs']
      ) {
        bundleUrl = payload.params.sourceUrl = config.env[message.channelId]['polify']['sourcejs']
      }
      else {
        bundleUrl = payload.params.sourceUrl = env['sourceUrl']
      }
      debuggerRouter.pushMessageByChannelId(
        'page.debugger',
        message.channelId,
        {
          method: 'WxDebug.bundleRendered',
          params: {
            bundleUrl: bundleUrl,
            env: {
              jsframework: config.env[message.channelId]['jsframework'],
              jsservice: payload.params.jsservice,
              workerjs: payload.params.workerjs,
              sourcejs: payload.params.sourceUrl
            },
            isSandbox: false
          }
        }
      )
    }
    else if (
      method === 'WxDebug.callJS' &&
      payload.params.method === 'destroyInstance'
    ) {
      config.ACTIVE_INSTANCEID = ''
    }
    else if (
      method === 'WxDebug.callJS' &&
      payload.params.method === 'createInstanceContext'
    ) {
      const options = payload.params.args[1]
      const dependenceCode = payload.params.args[3]
      let env = {
        environment: config.env[message.channelId]['environment'],
        device: config.env[message.channelId]['device'],
        isLayoutAndSandbox: config.env[message.channelId]['isLayoutAndSandbox']
      }
      let bundleUrl = options.bundleUrl
      if (
        /^(https?|taobao|qap):\/\/(.*your_current_ip):(\d+)\//i.test(bundleUrl)
      ) {
        bundleUrl =
          '/source/' +
          bundleUrl.replace(
            /^(https?|taobao|qap):\/\/(.*your_current_ip):(\d+)\//i,
            'file://'
          )
      }
      else if (/^file:\/\//.test(bundleUrl)) {
        bundleUrl = '/source/' + bundleUrl
      }
      else {
        bundleUrl = '/source/' + bundleUrl
      }
      config.ACTIVE_INSTANCEID = payload.params.args[0]

      if (dependenceCode) {
        config.env[message.channelId]['dependencejs'] = new MemoryFile(
          `dependencejs.js`,
          dependenceCode
        ).getUrl()
        if (
          config.env[message.channelId]['polify'] &&
          config.env[message.channelId]['polify']['dependencejs']
        ) {
          payload.params.dependencejs =
            config.env[message.channelId]['polify']['dependencejs']
        }
        else {
          payload.params.dependencejs =
            config.env[message.channelId]['dependencejs']
        }
      }

      if (
        config.env[message.channelId] &&
        config.env[message.channelId]['polify'] &&
        config.env[message.channelId]['polify']['jsservice']
      ) {
        payload.params.jsservice =
          config.env[message.channelId]['polify']['jsservice']
      }
      else {
        payload.params.jsservice = config.env[message.channelId]['jsservice']
      }

      if (
        config.env[message.channelId] &&
        config.env[message.channelId]['polify'] &&
        config.env[message.channelId]['polify']['jsframework']
      ) {
        env['jsframework'] =
          config.env[message.channelId]['polify']['jsframework']
      }
      else {
        env['jsframework'] = config.env[message.channelId]['jsframework']
      }

      env['isLayoutAndSandbox'] =
        config.env[message.channelId]['isLayoutAndSandbox']
      config.env[message.channelId]['workerjs'] = payload.params.workerjs = new MemoryFile(
        `[Runtime]/${path.basename(bundleUrl || '')}`,
        generateSandboxWorkerEntry(env)
      ).getUrl()

      if (
        config.env[message.channelId] &&
        config.env[message.channelId]['polify'] &&
        config.env[message.channelId]['polify']['workerjs']
      ) {
        payload.params.workerjs =
          config.env[message.channelId]['polify']['workerjs']
      }
      else {
        payload.params.workerjs = config.env[message.channelId]['workerjs']
      }
      if (
        config.env[message.channelId] &&
        config.env[message.channelId]['polify'] &&
        config.env[message.channelId]['polify']['sourcejs']
      ) {
        bundleUrl = config.env[message.channelId]['polify']['sourcejs']
      }
      else if (config.env[message.channelId]['sourcejs']) {
        bundleUrl = config.env[message.channelId]['sourcejs']
      }
      debuggerRouter.pushMessageByChannelId(
        'page.debugger',
        message.channelId,
        {
          method: 'WxDebug.bundleRendered',
          params: {
            bundleUrl: bundleUrl,
            env: {
              jsframework: env['jsframework'],
              jsservice: payload.params.jsservice,
              workerjs: payload.params.workerjs,
              dependencejs: payload.params.dependencejs,
              sourcejs: bundleUrl
            },
            isSandbox: true
          }
        }
      )
    }
    else if (
      method === 'WxDebug.callJS' &&
      payload.params.method === 'importScript'
    ) {
      const code = payload.params.args[1]
      let bundleUrl =
        (payload.params.args[2] && payload.params.args[2].bundleUrl) ||
        crypto.md5(code) + '.js'
      bundleUrl = bundleUrl.replace(/\?random=(-)?\d+/i, '')
      if (!config.env[message.channelId]) {
        config.env[message.channelId] = {}
      }
      if (
        config.env[message.channelId] &&
        config.env[message.channelId]['polify'] &&
        config.env[message.channelId]['polify']['sourcejs']
      ) {
        payload.params.sourceUrl =
          config.env[message.channelId]['polify']['sourcejs']
      }
      else {
        config.env[message.channelId]['sourcejs'] = payload.params.sourceUrl = new MemoryFile(bundleUrl, code).getUrl()
      }
    }
    else if (method === 'WxDebug.importScript') {
      const code = payload.params.source
      const url = new MemoryFile(
        `jsservice_${crypto.md5(code)}.js`,
        payload.params.source
      ).getUrl()
      if (!config.env[message.channelId]['jsservice']) {
        config.env[message.channelId]['jsservice'] = []
      }
      if (config.env[message.channelId]['jsservice'].indexOf(url) === -1) {
        config.env[message.channelId]['jsservice'].push(url)
      }
    }
    else if (method === 'syncReturn') {
      message.payload = {
        error: payload.error,
        ret: payload.params && payload.params.ret
      }
      message.to('sync.native')
      return
    }
    else if (method === 'WxDebug.sendTracingData') {
      message.to('page.debugger')
      return
    }
    else if (method === 'WxDebug.sendSummaryInfo') {
      message.to('page.debugger')
      return
    }
    else if (method === 'WxDebug.sendPerformanceData') {
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
      if (device && device.remoteDebug) {
        message.discard()
      }
      else {
        message.payload = {
          method: 'Runtime.consoleAPICalled',
          params: {
            type: payload.params.message.level,
            args:
              [
                {
                  type: 'string',
                  value: payload.params.message.text
                }
              ] || [],
            executionContextId: 1
            // "stackTrace": payload.params.message.stackTrace
          }
        }
      }
    }
    else if (
      payload.result &&
      payload.result.method === 'WxDebug.syncReturn'
    ) {
      message.payload = {
        id:
          payload.result.params &&
          payload.result.id &&
          payload.result.params.syncId,
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
  .when(
    '!payload.method||(payload.method.split(".")[0]!=="WxDebug")'
  )
