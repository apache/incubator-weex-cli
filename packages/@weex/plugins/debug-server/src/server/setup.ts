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
import * as fse from 'fs-extra'
import * as path from 'path'
import utils from '../utils'
import { Router, Hub } from '@weex-cli/linker'
import { Config } from '../ConfigResolver'

export const setup = (handlerPath: string) => {
  const debuggerRouter = new Router(`debugger-${Config.get('channelId')}`)
  const nativeProxyHub = new Hub('proxy.native')
  const debuggerHub = new Hub('page.debugger')
  const inspectorHub = new Hub('proxy.inspector')
  const runtimeWorkerHub = new Hub('runtime.worker')
  const entryHub = new Hub('page.entry')
  const runtimeProxyHub = new Hub('runtime.proxy')
  const syncNativeHub = new Hub('sync.native')
  const syncV8Hub = new Hub('sync.v8')
  debuggerRouter.newChannel(Config.get('channelId'))
  debuggerRouter.link(nativeProxyHub)
  debuggerRouter.link(debuggerHub)
  debuggerRouter.link(inspectorHub)
  debuggerRouter.link(entryHub)
  debuggerRouter.link(syncNativeHub)
  debuggerRouter.link(syncV8Hub)
  debuggerRouter.link(runtimeWorkerHub)
  debuggerRouter.link(runtimeProxyHub)
  Config.set(`debugger-${Config.get('channelId')}`, {})
  let files = fse.readdirSync(handlerPath)
  files.forEach((file: string) => {
    if (path.extname(file) === '.js') {
      utils.loader.loadModule(path.join(handlerPath, file))
    }
  })
  return debuggerRouter
}

export default {
  setup,
}
