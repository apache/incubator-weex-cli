const Koa = require('koa')
const serve = require('koa-static')
const Websockify = require('koa-websocket')
const bodyParser = require('koa-bodyparser')
const WsRouter = require('./router/websocket')
const HttpRouter = require('./router/http')
const app = Websockify(new Koa())
const { setup } = require('../link/setup')
const { logger } = require('../util')
const config = require('../config')

exports.start = (port, cb) => {
  setup()
  app.use(bodyParser())
  app.ws.use(WsRouter.routes()).use(WsRouter.allowedMethods())
  app.use(HttpRouter.routes())

  if (config.STATIC_SOURCE) {
    app.use(serve(config.STATIC_SOURCE))
  }

  app.use(serve(config.STATIC_SOURCE))

  app.on('error', (err, ctx) => {
    console.log(err)
    logger.verbose(err)
  })

  app.listen(port, cb)
}
