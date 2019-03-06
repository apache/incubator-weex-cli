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
