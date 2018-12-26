const Router = require('koa-router')
const MemoryFile = require('../../MemoryFile')
const mlink = require('../../link')
const DeviceManager = require('../../link/managers/device_manager')
const URL = require('url')
const config = require('../../config')
const protocols = {
  'http:': require('http'),
  'https:': require('https')
}
const { logger } = require('../../util')

const httpRouter = new Router()

let syncCallNativeIndex = 0
let syncCallJSIndex = 0
const SyncTerminal = mlink.Terminal.SyncTerminal
const syncNativeHub = mlink.Hub.get('sync.native')
const syncV8Hub = mlink.Hub.get('sync.v8')

const rSourceMapDetector = /\.map$/

const getRemote = url => {
  return new Promise(function (resolve, reject) {
    const urlObj = URL.parse(url)
    ;(protocols[urlObj.protocol] || protocols['http:'])
      .get(
        {
          hostname: urlObj.hostname,
          port: urlObj.port,
          path: urlObj.path,
          method: 'GET',
          headers: {
            'User-Agent': 'Weex/1.0.0'
          }
        },
        function (res) {
          let chunks = []
          res.on('data', function (chunk) {
            chunks.push(chunk)
          })
          res.on('end', function () {
            resolve(Buffer.concat(chunks).toString())
            chunks = null
          })
        }
      )
      .on('error', function (e) {
        reject(e)
      })
  })
}

httpRouter.get('/source/*', async (ctx, next) => {
  const path = ctx.params[0]
  if (rSourceMapDetector.test(path)) {
    logger.verbose(`Fetch sourcemap ${path}`)
    let content
    try {
      content = await getRemote('http://' + path)
    }
    catch (e) {
      logger.verbose(`Failed to fetch, reason: ${e.stack}`)
    }
    if (!content) {
      ctx.response.status = 404
    }
    else {
      ctx.response.status = 200
      ctx.type = 'text/javascript'
      ctx.set('Access-Control-Allow-Origin', '*')
      ctx.response.body = content
    }
  }
  else {
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
