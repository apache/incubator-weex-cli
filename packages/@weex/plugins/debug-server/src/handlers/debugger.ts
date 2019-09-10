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
import { Device } from '../managers/DeviceManager'
import { Config } from '../ConfigResolver'
import * as uuid from 'uuid'

import * as DEBUG from 'debug'
const debug = DEBUG('Handler:Page.Entry')

let environmentMap = Config.get(`debugger-${Config.get('channelId')}`)
const debuggerRouter = Router.get(`debugger-${Config.get('channelId')}`)

let heartbeatTimer
const sendHeartbeat = () => {
  heartbeatTimer && clearTimeout(heartbeatTimer)
  heartbeatTimer = setTimeout(() => {
    debuggerRouter.pushMessage('page.debugger', 'ping')
    debug('ping-pong')
    sendHeartbeat()
  }, Config.get('heartbeatTime') || 30000)
}

debuggerRouter
  .registerHandler((message: Message) => {
    const payload = message.payload
    const method = payload.method
    const device = Device.getDevice(message.channelId)
    sendHeartbeat()
    if (!device) {
      message.discard()
      return
    }
    if (method === 'WxDebug.setLogLevel') {
      device.logLevel = payload.params.data
      message.payload = {
        method: 'WxDebug.setLogLevel',
        params: {
          logLevel: payload.params.data,
        },
      }
      debuggerRouter.pushMessage('runtime.worker', message.terminalId, {
        method: 'WxDebug.setLogLevel',
        params: {
          logLevel: payload.params.data,
        },
      })
      debuggerRouter.pushMessage('page.debugger', message.terminalId, {
        method: 'WxDebug.reloadInspector',
      })
      debuggerRouter.pushMessage('page.debugger', message.terminalId, {
        method: 'WxDebug.reloadRuntime',
      })
    } else if (method === 'WxDebug.setElementMode') {
      device.elementMode = payload.params.data
      message.payload = {
        method: 'WxDebug.setElementMode',
        params: {
          mode: payload.params.data,
        },
      }
      debuggerRouter.pushMessage('page.debugger', message.terminalId, {
        method: 'WxDebug.reloadInspector',
      })
      debuggerRouter.pushMessage('page.debugger', message.terminalId, {
        method: 'WxDebug.reloadRuntime',
      })
    } else if (method === 'WxDebug.network') {
      device && (device.network = payload.params.enable)
      message.payload = {
        method: 'WxDebug.network',
        params: {
          enable: payload.params.enable,
        },
      }
      debuggerRouter.pushMessage('page.debugger', message.terminalId, {
        method: 'WxDebug.reloadInspector',
      })
      debuggerRouter.pushMessage('page.debugger', message.terminalId, {
        method: 'WxDebug.reloadRuntime',
      })
    } else if (method === 'WxDebug.enable') {
      device && (device.remoteDebug = true)
    } else if (method === 'WxDebug.disable') {
      device && (device.remoteDebug = false)
      debuggerRouter.pushMessage('page.debugger', message.terminalId, {
        method: 'WxDebug.reloadInspector',
      })
    } else if (method === 'WxDebug.setContextEnvironment') {
      if (!environmentMap[payload.params.channelId]) {
        environmentMap[payload.params.channelId] = {}
      }
      if (!environmentMap[payload.params.channelId]['polify']) {
        environmentMap[payload.params.channelId]['polify'] = {
          jsframework: '',
          jsservice: [],
          dependencejs: '',
          sourcejs: '',
        }
      }
      environmentMap[payload.params.channelId]['polify']['jsframework'] = payload.params['jsframework']
      if (payload.params['jsservice']) {
        environmentMap[payload.params.channelId]['polify']['jsservice'] = payload.params['jsservice'].split(',')
      }

      environmentMap[payload.params.channelId]['polify']['dependencejs'] = payload.params['dependencejs']
      environmentMap[payload.params.channelId]['polify']['workerjs'] = payload.params['workerjs']
      environmentMap[payload.params.channelId]['polify']['sourcejs'] = payload.params['sourcejs']
      message.discard()
    } else if (method === 'WxDebug.postTemplateFile') {
      let templateFile = new MemoryFile(`${uuid()}.js`, payload.params.value).getUrl()
      debuggerRouter.pushMessage('page.debugger', message.terminalId, {
        method: 'WxDebug.getTemplateFile',
        params: {
          value: templateFile,
        },
      })
      message.discard()
    }
    message.to('proxy.native')
  })
  .at('page.debugger')
