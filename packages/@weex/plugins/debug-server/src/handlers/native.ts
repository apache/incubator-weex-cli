/* Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { Router, Message } from '@weex-cli/linker'
import MemoryFile from '../MemoryFile'
import { Config } from '../ConfigResolver'
import { Device } from '../managers/DeviceManager'
import utils from '../utils'

import * as DEBUG from 'debug'
const debug = DEBUG('Handler:Proxy.Native')

const debuggerRouter = Router.get(`debugger-${Config.get('channelId')}`)
let environmentMap = Config.get(`debugger-${Config.get('channelId')}`)
let vmIndex = 0
let jsserviceIndex = 0

let heartbeatTimer
const sendHeartbeat = () => {
  heartbeatTimer && clearTimeout(heartbeatTimer)
  heartbeatTimer = setTimeout(() => {
    debuggerRouter.pushMessage('proxy.native', 'ping')
    debug('ping-pong')
    sendHeartbeat()
  }, Config.get('heartbeatTime') || 30000)
}

debuggerRouter
  .registerHandler(async (message: Message) => {
    const payload = message.payload
    const method = payload.method
    const device = Device.getDevice(message.channelId)
    if (method === 'WxDebug.initJSRuntime') {
      if (!environmentMap[message.channelId]) {
        environmentMap[message.channelId] = {}
      }
      environmentMap[message.channelId]['jsframework'] = new MemoryFile(
        'js-framework.js',
        payload.params.source,
      ).getUrl()
      if (device && device.logLevel) {
        payload.params.env.WXEnvironment.logLevel = device.logLevel
      }
      environmentMap[message.channelId]['isLayoutAndSandbox'] = payload.params.isLayoutAndSandbox
      environmentMap[message.channelId]['environment'] = payload.params.env
      environmentMap[message.channelId]['device'] = device
    } else if (method === 'WxDebug.callJS' && payload.params.method === 'createInstance') {
      const code = payload.params.args[1]
      let bundleUrl = payload.params.args[2].bundleUrl
      let env = {
        environment: environmentMap[message.channelId]['environment'],
        device: environmentMap[message.channelId]['device'],
        isLayoutAndSandbox: environmentMap[message.channelId]['isLayoutAndSandbox'],
      }
      if (/^(https?|taobao|qap):\/\/(.*your_current_ip):(\d+)\//i.test(bundleUrl)) {
        bundleUrl = bundleUrl.replace(/^(https?|taobao|qap):\/\/(.*your_current_ip):(\d+)\//i, 'file://')
      }
      env['sourceUrl'] = new MemoryFile(
        bundleUrl,
        utils.wrapper.bundleWrapper(code, utils.wrapper.transformUrlToLocalUrl(bundleUrl)),
      ).getUrl()
      if (
        environmentMap[message.channelId] &&
        environmentMap[message.channelId]['polify'] &&
        environmentMap[message.channelId]['polify']['jsframework']
      ) {
        env['jsframework'] = environmentMap[message.channelId]['polify']['jsframework']
      } else {
        env['jsframework'] = environmentMap[message.channelId]['jsframework']
      }
      environmentMap[message.channelId]['workerjs'] = payload.params.workerjs = new MemoryFile(
        `VM_${vmIndex++}`,
        utils.wrapper.generateWorkerEntry(env),
      ).getUrl()
      if (environmentMap[message.channelId]['polify'] && environmentMap[message.channelId]['polify']['workerjs']) {
        env['workerjs'] = environmentMap[message.channelId]['polify']['workerjs']
      } else {
        env['workerjs'] = environmentMap[message.channelId]['workerjs']
      }
      payload.params.workerjs = env['workerjs']
      if (
        environmentMap[message.channelId]['polify'] &&
        Array.isArray(environmentMap[message.channelId]['polify']['jsservice']) &&
        environmentMap[message.channelId]['polify']['jsservice'].length > 0
      ) {
        payload.params.jsservice = environmentMap[message.channelId]['polify']['jsservice']
      } else {
        payload.params.jsservice = environmentMap[message.channelId]['jsservice']
      }
      if (
        environmentMap[message.channelId] &&
        environmentMap[message.channelId]['polify'] &&
        environmentMap[message.channelId]['polify']['sourcejs']
      ) {
        bundleUrl = payload.params.sourceUrl = environmentMap[message.channelId]['polify']['sourcejs']
      } else {
        bundleUrl = payload.params.sourceUrl = env['sourceUrl']
      }
      await debuggerRouter.pushMessageByChannelId('page.debugger', message.channelId, {
        method: 'WxDebug.bundleRendered',
        params: {
          bundleUrl: bundleUrl,
          env: {
            jsframework: environmentMap[message.channelId]['jsframework'],
            jsservice: payload.params.jsservice,
            workerjs: payload.params.workerjs,
            sourcejs: payload.params.sourceUrl,
          },
          isSandbox: false,
        },
      })
    } else if (method === 'WxDebug.callJS' && payload.params.method === 'destroyInstance') {
      Config.set('ACTIVE_INSTANCEID', '')
    } else if (method === 'WxDebug.callJS' && payload.params.method === 'createInstanceContext') {
      const options = payload.params.args[1]
      const dependenceCode = payload.params.args[3]
      let env = {
        environment: environmentMap[message.channelId]['environment'],
        device: environmentMap[message.channelId]['device'],
        isLayoutAndSandbox: environmentMap[message.channelId]['isLayoutAndSandbox'],
      }
      let bundleUrl = options.bundleUrl
      if (/^(https?|taobao|qap):\/\/(.*your_current_ip):(\d+)\//i.test(bundleUrl)) {
        bundleUrl = '/source/' + bundleUrl.replace(/^(https?|taobao|qap):\/\/(.*your_current_ip):(\d+)\//i, 'file://')
      } else if (/^file:\/\//.test(bundleUrl)) {
        bundleUrl = '/source/' + bundleUrl
      } else {
        bundleUrl = '/source/' + bundleUrl
      }
      Config.set('ACTIVE_INSTANCEID', payload.params.args[0])
      if (dependenceCode) {
        environmentMap[message.channelId]['dependencejs'] = new MemoryFile(`dependencejs.js`, dependenceCode).getUrl()
        if (
          environmentMap[message.channelId]['polify'] &&
          environmentMap[message.channelId]['polify']['dependencejs']
        ) {
          payload.params.dependencejs = environmentMap[message.channelId]['polify']['dependencejs']
        } else {
          payload.params.dependencejs = environmentMap[message.channelId]['dependencejs']
        }
      }

      if (
        environmentMap[message.channelId] &&
        environmentMap[message.channelId]['polify'] &&
        environmentMap[message.channelId]['polify']['jsservice']
      ) {
        payload.params.jsservice = environmentMap[message.channelId]['polify']['jsservice']
      } else {
        payload.params.jsservice = environmentMap[message.channelId]['jsservice']
      }

      if (
        environmentMap[message.channelId] &&
        environmentMap[message.channelId]['polify'] &&
        environmentMap[message.channelId]['polify']['jsframework']
      ) {
        env['jsframework'] = environmentMap[message.channelId]['polify']['jsframework']
      } else {
        env['jsframework'] = environmentMap[message.channelId]['jsframework']
      }

      env['isLayoutAndSandbox'] = environmentMap[message.channelId]['isLayoutAndSandbox']
      environmentMap[message.channelId]['workerjs'] = payload.params.workerjs = new MemoryFile(
        `VM_${vmIndex++}`,
        utils.wrapper.generateSandboxWorkerEntry(env),
      ).getUrl()

      if (
        environmentMap[message.channelId] &&
        environmentMap[message.channelId]['polify'] &&
        environmentMap[message.channelId]['polify']['workerjs']
      ) {
        payload.params.workerjs = environmentMap[message.channelId]['polify']['workerjs']
      } else {
        payload.params.workerjs = environmentMap[message.channelId]['workerjs']
      }
      if (
        environmentMap[message.channelId] &&
        environmentMap[message.channelId]['polify'] &&
        environmentMap[message.channelId]['polify']['sourcejs']
      ) {
        bundleUrl = environmentMap[message.channelId]['polify']['sourcejs']
      } else if (environmentMap[message.channelId]['sourcejs']) {
        bundleUrl = environmentMap[message.channelId]['sourcejs']
      }
      await debuggerRouter.pushMessageByChannelId('page.debugger', message.channelId, {
        method: 'WxDebug.bundleRendered',
        params: {
          bundleUrl: bundleUrl,
          env: {
            jsframework: env['jsframework'],
            jsservice: payload.params.jsservice,
            workerjs: payload.params.workerjs,
            dependencejs: payload.params.dependencejs,
            sourcejs: bundleUrl,
          },
          isSandbox: true,
        },
      })
    } else if (method === 'WxDebug.callJS' && payload.params.method === 'importScript') {
      const code = payload.params.args[1]
      let bundleUrl = payload.params.args[2] && payload.params.args[2].bundleUrl
      bundleUrl = bundleUrl.replace(/\?random=(-)?\d+/i, '')
      if (
        environmentMap[message.channelId] &&
        environmentMap[message.channelId]['polify'] &&
        environmentMap[message.channelId]['polify']['sourcejs']
      ) {
        payload.params.sourceUrl = environmentMap[message.channelId]['polify']['sourcejs']
      } else {
        environmentMap[message.channelId]['sourcejs'] = payload.params.sourceUrl = new MemoryFile(
          bundleUrl,
          code,
        ).getUrl()
      }
    } else if (method === 'WxDebug.importScript') {
      const url = new MemoryFile(`jsservice_${jsserviceIndex++}.js`, payload.params.source).getUrl()
      if (!environmentMap[message.channelId]['jsservice']) {
        environmentMap[message.channelId]['jsservice'] = []
      }
      if (environmentMap[message.channelId]['jsservice'].indexOf(url) === -1) {
        environmentMap[message.channelId]['jsservice'].push(url)
      }
    } else if (method === 'syncReturn') {
      message.payload = {
        error: payload.error,
        ret: payload.params && payload.params.ret,
      }
      message.to('sync.native')
      return
    } else if (method === 'WxDebug.sendTracingData') {
      message.to('page.debugger')
      return
    } else if (method === 'WxDebug.sendSummaryInfo') {
      message.to('page.debugger')
      return
    } else if (method === 'WxDebug.sendPerformanceData') {
      message.to('page.debugger')
      return
    }
    message.to('runtime.worker')
  })
  .at('proxy.native')
  .when('payload.method&&payload.method.split(".")[0]==="WxDebug"')

debuggerRouter
  .registerHandler(function(message) {
    const payload = message.payload
    const device = Device.getDevice(message.channelId)
    if (payload.method === 'Page.screencastFrame') {
      payload.params.sessionId = 1
      if (device && device.platform === 'android') {
        payload.params.metadata.pageScaleFactor = 0.999
      }
    } else if (payload.method === 'Console.messageAdded') {
      // issue: https://github.com/weexteam/weex-toolkit/issues/408
      // TODO: make it can be control by user
      if (device && device.remoteDebug) {
        message.discard()
      } else {
        message.payload = {
          method: 'Runtime.consoleAPICalled',
          params: {
            type: payload.params.message.level,
            args:
              [
                {
                  type: 'string',
                  value: payload.params.message.text,
                },
              ] || [],
            executionContextId: 1,
            // "stackTrace": payload.params.message.stackTrace
          },
        }
      }
    } else if (payload.result && payload.result.method === 'WxDebug.syncReturn') {
      message.payload = {
        id: payload.result.params && payload.result.id && payload.result.params.syncId,
        error: payload.error,
        ret: payload.result.params && payload.result.params.ret,
      }
      message.to('sync.native')
      return
    } else if (payload.result && payload.id === undefined) {
      message.discard()
    }
    message.to('proxy.inspector')
  })
  .at('proxy.native')
  .when('!payload.method||(payload.method.split(".")[0]!=="WxDebug")')

debuggerRouter
  .registerHandler(async () => {
    sendHeartbeat()
  })
  .at('proxy.native')
