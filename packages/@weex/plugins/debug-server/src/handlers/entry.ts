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
import * as opn from 'opn'
import { Config } from '../ConfigResolver'

import * as DEBUG from 'debug'
const debug = DEBUG('Handler:Page.Entry')

const debuggerRouter = Router.get(`debugger-${Config.get('channelId')}`)

let heartbeatTimer
const sendHeartbeat = () => {
  heartbeatTimer && clearTimeout(heartbeatTimer)
  heartbeatTimer = setTimeout(() => {
    debuggerRouter.pushMessage('page.entry', 'ping')
    debug('ping-pong')
    sendHeartbeat()
  }, Config.get('heartbeatTime') || 30000)
}

debuggerRouter
  .registerHandler((message: Message) => {
    let method = message.payload.method
    sendHeartbeat()
    if (method === 'WxDebug.queryServerVersion') {
      let pkg = require('../../package.json')
      debuggerRouter.pushMessage('page.entry', {
        method: 'WxDebug.pushServerVersion',
        params: {
          version: pkg.version,
        },
      })
      message.discard()
    } else if (method === 'WxDebug.openFile') {
      opn(message.payload.params)
    }
  })
  .at('page.entry')
