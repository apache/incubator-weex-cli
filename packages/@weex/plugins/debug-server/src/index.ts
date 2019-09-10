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
import Devtool from './Devtool'
import debugServer from './server'
import ConfigResolver from './ConfigResolver'
import * as ip from 'ip'
import * as uuid from 'uuid'

const startServer = async port => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await debugServer.start(port)
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

export const start = async (options: any) => {
  if (!options.port) {
    options.port = '8888'
  }
  if (!options.ip) {
    options.ip = ip.address()
  }
  if (!options.channelId) {
    options.channelId = uuid()
  }
  if (!options.remoteDebugPort) {
    options.remoteDebugPort = '9222'
  }
  const Config = new ConfigResolver(options)
  const origin = `ws://${Config.get('ip')}:${Config.get('port')}`
  const result: any = await startServer(Config.get('port'))
  const socket = {
    entry: `${origin}/page/entry/${Config.get('channelId') || ''}`,
    native: `${origin}/debugProxy/native/${Config.get('channelId') || ''}`,
    debugger: `${origin}/debugProxy/debugger/${Config.get('channelId') || ''}`,
    inspector: `${origin}/debugProxy/inspector/${Config.get('channelId') || ''}`,
    runtime: `${origin}/debugProxy/runtime/${Config.get('channelId') || ''}`,
  }
  const runtime = `http://${Config.get('ip')}:${Config.get('port')}/runtime.html`
  return new Devtool(result.server, socket, runtime, result.event)
}

export { default as Devtool } from './Devtool'

export default {
  start,
  Devtool,
}
