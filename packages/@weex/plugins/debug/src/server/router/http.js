const Router = require('koa-router')
const MemoryFile = require('../../MemoryFile')
const mlink = require('../../link')
const DeviceManager = require('../../link/managers/device_manager')
const config = require('../../config')

const httpRouter = new Router()

let syncCallNativeIndex = 0
let syncCallJSIndex = 0
const SyncTerminal = mlink.Terminal.SyncTerminal
const syncNativeHub = mlink.Hub.get('sync.native')
const syncV8Hub = mlink.Hub.get('sync.v8')

httpRouter.get('/source/*', async (ctx, next) => {
  const path = ctx.params[0]
  let query = ctx.request.url.split('?')
  query = query[1] ? '?' + query.slice(1).join('?') : ''
  const file = MemoryFile.get(path + query)
  if (file) {
    ctx.response.status = 200
    ctx.type = 'text/javascript'
    ctx.response.body = file.getContent()
  }
  else {
    ctx.response.status = 404
  }
  await next()
})

httpRouter.post('/syncCallNative/*', async (ctx, next) => {
  const idx = syncCallNativeIndex++
  const payload = ctx.request.body
  const channelId = ctx.params[0]
  const device = DeviceManager.getDevice(channelId)
  if (device) {
    const terminal = new SyncTerminal()
    terminal.channelId = channelId
    syncNativeHub.join(terminal, false)
    payload.params.syncId = 100000 + idx
    payload.id = 100000 + idx
    const data = await terminal.send(payload)
    ctx.response.status = 200
    ctx.type = 'application/json'
    ctx.response.body = JSON.stringify(data)
  }
  else {
    ctx.response.status = 500
  }
  await next()
})

httpRouter.post('/syncCallJS/*', async (ctx, next) => {
  const idx = syncCallJSIndex++
  const channelId = ctx.params[0]
  const payload = ctx.request.body
  const device = DeviceManager.getDevice(channelId)
  const instanceId = payload.params.args[0]
  if (device) {
    const terminal = new SyncTerminal()
    let data
    terminal.channelId = channelId
    syncV8Hub.join(terminal, false)
    payload.params.syncId = 100000 + idx
    payload.id = 100000 + idx
    if (config.ACTIVE_INSTANCEID !== instanceId) {
      data = [{}]
    }
    else {
      data = await terminal.send(payload)
    }
    ctx.response.status = 200
    ctx.type = 'application/json'
    ctx.response.body = JSON.stringify(data.ret)
  }
  else {
    ctx.response.status = 500
  }
  await next()
})

module.exports = httpRouter
