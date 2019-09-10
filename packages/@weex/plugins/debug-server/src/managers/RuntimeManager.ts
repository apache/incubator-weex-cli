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
import { Terminal } from '@weex-cli/linker'
import * as WebSocket from 'ws'
import * as url from 'url'
import utils from '../utils'
import { Config } from '../ConfigResolver'
import * as DEBUG from 'debug'
const debug = DEBUG('runtime manager')
const WebsocketTerminal = Terminal.WebsocketTerminal
export default class RuntimeManager {
  private runtimeTerminalMap: any = {}

  connect(channelId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        let data: any
        try {
          data = await utils.request.getRemote(`http://localhost:${Config.get('remoteDebugPort') || 9222}/json`)
        } catch (error) {
          debug(`Http request error: ${error}`)
        }
        debug(`Json data: ${JSON.stringify(data)}`)
        let list
        if (data && typeof data === 'string') {
          try {
            list = JSON.parse(data)
          } catch (error) {
            debug(`Parse JSON error: ${error}`)
          }
        } else {
          list = data
        }
        let found: any = false
        for (let target in list) {
          const urlObj = url.parse(list[target].url)
          if (
            urlObj.pathname === '/runtime.html' &&
            urlObj.port === Config.get('port') + '' &&
            urlObj.query === `channelId=${Config.get('channelId')}`
          ) {
            found = list[target]
            break
          } else if (urlObj.pathname === '/debug.html') {
            found = list[target]
          }
        }
        if (found) {
          if (found.webSocketDebuggerUrl) {
            debug(`Found the webSocketDebuggerUrl: ${found.webSocketDebuggerUrl}`)
            const ws = new WebSocket(found.webSocketDebuggerUrl)
            const terminal = new WebsocketTerminal(ws, channelId)
            const _runtimeTerminalMaps = this.runtimeTerminalMap[channelId]
            if (_runtimeTerminalMaps && _runtimeTerminalMaps.length > 0) {
              _runtimeTerminalMaps.unshift(terminal)
            } else {
              this.runtimeTerminalMap[channelId] = [terminal]
            }
            resolve(terminal)
          } else {
            debug(`Not found the webSocketDebuggerUrl from the ${found}`)
            reject(new Error('webSocketDebuggerUrl not found'))
          }
        } else {
          debug(`Not found the webSocketDebuggerUrl`)
          reject(new Error('webSocketDebuggerUrl not found'))
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  remove(channelId) {
    const terminals = this.runtimeTerminalMap[channelId]
    if (terminals && terminals.length > 0) {
      const popTerminal = terminals.pop()
      popTerminal.websocket.close()
    } else {
      debug('Error: Try to remove a non-exist runtime')
    }
  }

  has(channelId) {
    const terminals = this.runtimeTerminalMap[channelId]
    return terminals && terminals.length > 0
  }
}

export const Runtime = new RuntimeManager()
