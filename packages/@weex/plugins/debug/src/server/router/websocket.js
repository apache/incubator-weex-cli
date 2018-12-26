const Router = require('koa-router')
const mlink = require('../../link')
const WebsocketTerminal = mlink.Terminal.WebsocketTerminal

const inspectorHub = mlink.Hub.get('proxy.inspector')
const proxyNativeHub = mlink.Hub.get('proxy.native')
const proxyDebuggerHub = mlink.Hub.get('page.debugger')
const runtimeWorkerHub = mlink.Hub.get('runtime.worker')
const entryHub = mlink.Hub.get('page.entry')
const wsRouter = Router()

wsRouter.all('/page/entry', async (ctx, next) => {
  const terminal = new WebsocketTerminal(ctx.websocket)
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

module.exports = wsRouter
