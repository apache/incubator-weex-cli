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
import { Router, Hub, Message } from '@weex-cli/linker'
import { Runtime } from '../managers/RuntimeManager'
import { Device } from '../managers/DeviceManager'
import { Config } from '../ConfigResolver'

import * as DEBUG from 'debug'
const debug = DEBUG('Handler:Runtime.Worker')

const debuggerRouter = Router.get(`debugger-${Config.get('channelId')}`)
const runtimeProxyHub = Hub.get('runtime.proxy')

let heartbeatTimer
const sendHeartbeat = () => {
  heartbeatTimer && clearTimeout(heartbeatTimer)
  heartbeatTimer = setTimeout(() => {
    debuggerRouter.pushMessage('runtime.worker', 'ping')
    debug('ping-pong')
    sendHeartbeat()
  }, Config.get('heartbeatTime') || 30000)
}

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
    sendHeartbeat()
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
