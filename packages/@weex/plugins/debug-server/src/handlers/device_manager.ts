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
