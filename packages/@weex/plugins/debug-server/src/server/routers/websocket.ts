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
import * as koaRouter from 'koa-router'
import { Hub, Terminal } from '@weex-cli/linker'
const WebsocketTerminal = Terminal.WebsocketTerminal

const inspectorHub = Hub.get('proxy.inspector')
const proxyNativeHub = Hub.get('proxy.native')
const proxyDebuggerHub = Hub.get('page.debugger')
const runtimeWorkerHub = Hub.get('runtime.worker')
const entryHub = Hub.get('page.entry')
const wsRouter = koaRouter()

wsRouter.all('/page/entry/:channelId', async (ctx, next) => {
  const terminal = new WebsocketTerminal(ctx.websocket)
  terminal.channelId = ctx.params.channelId
  entryHub.join(terminal, false)
  await next()
})

wsRouter.all('/debugProxy/inspector/:channelId', async (ctx, next) => {
  const terminal = new WebsocketTerminal(ctx.websocket)
  terminal.channelId = ctx.params.channelId
  inspectorHub.join(terminal, false)
  await next()
})

wsRouter.all('/debugProxy/debugger/:channelId', async (ctx, next) => {
  const terminal = new WebsocketTerminal(ctx.websocket)
  terminal.channelId = ctx.params.channelId
  proxyDebuggerHub.join(terminal, true)
  await next()
})

wsRouter.all('/debugProxy/runtime/:channelId', async (ctx, next) => {
  const terminal = new WebsocketTerminal(ctx.websocket)
  terminal.channelId = ctx.params.channelId
  runtimeWorkerHub.join(terminal, true)
  await next()
})

wsRouter.all('/debugProxy/native/:channelId', async (ctx, next) => {
  const terminal = new WebsocketTerminal(ctx.websocket)
  terminal.channelId = ctx.params.channelId
  proxyNativeHub.join(terminal, true)
  await next()
})

export default wsRouter
