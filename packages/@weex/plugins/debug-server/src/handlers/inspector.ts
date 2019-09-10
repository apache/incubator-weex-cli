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
import { Config } from '../ConfigResolver'
import { Device } from '../managers/DeviceManager'

import * as DEBUG from 'debug'
const debug = DEBUG('Handler:Proxy.Inspector')

const debuggerRouter = Router.get(`debugger-${Config.get('channelId')}`)

const redirectMessage = /^(Page.(enable|disable|reload)|Debugger|Target|Worker|Runtime\.runIfWaitingForDebugger)/
const ignoredMessage = /^(ServiceWorker)/

const chromeDevtoolDiabledProtocol = [
  // 'Network.enable',
  'Page.getResourceTree',
  // 'Profiler.enable',
  // 'Runtime.enable',
  // 'DOM.enable',
  // 'CSS.enable',
  // 'Log.enable',
  // 'Log.startViolationsReport',
  // 'Overlay.setShowViewportSizeOnResize',
  // 'ServiceWorker.enable',
  // 'Inspector.enable',
  // 'Target.setRemoteLocations',
  // 'Page.setAdBlockingEnabled'
]

let heartbeatTimer
const sendHeartbeat = () => {
  heartbeatTimer && clearTimeout(heartbeatTimer)
  heartbeatTimer = setTimeout(() => {
    debuggerRouter.pushMessage('proxy.inspector', 'ping')
    debug('ping-pong')
    sendHeartbeat()
  }, Config.get('heartbeatTime') || 30000)
}

debuggerRouter
  .registerHandler(async (message: Message) => {
    const method = message.payload.method
    const device = Device.getDevice(message.channelId)
    sendHeartbeat()
    if (device) {
      if (redirectMessage.test(message.payload.method)) {
        if (message.payload && message.payload.method === 'Page.reload') {
          message.payload.ignoreCache = true
        }
        message.to('runtime.proxy')
      } else if (ignoredMessage.test(message.payload.method)) {
        message.discard()
      } else {
        if (method === 'Page.startScreencast') {
          message.to('page.debugger')
        } else if (method === 'Runtime.enable') {
          message.payload.method = 'Console.enable'
        } else if (method === 'Page.screencastFrameAck') {
          message.to('page.debugger')
        }
        message.to('proxy.native')
      }
      if (chromeDevtoolDiabledProtocol.indexOf(method) >= 0) {
        message.payload = {
          id: message.payload.id,
          result: {},
        }
        message.reply()
      }
    } else {
      await debuggerRouter.pushMessageByChannelId('page.debugger', message.channelId, {
        method: 'WxDebug.deviceDisconnect',
        params: device,
      })
    }
  })
  .at('proxy.inspector')
