const path = require('path')
const Koa = require('koa')
const serve = require('koa-static')
const Websockify = require('koa-websocket')
const bodyParser = require('koa-bodyparser')
const WsRouter = require('./router/websocket')
const HttpRouter = require('./router/http')
const redirectHttpRouter = require('./router/redirect')
const app = Websockify(new Koa())
const rootPath = path.join(__dirname, '../../frontend/public')
const { setup } = require('../link/setup')
const { logger } = require('../util')

exports.start = (port, cb) => {
  setup()
  app.use(bodyParser())
  app.ws.use(WsRouter.routes()).use(WsRouter.allowedMethods())
  app.use(serve(rootPath))
  app.use(HttpRouter.routes())
  app.use(redirectHttpRouter.routes())
  app.on('error', (err, ctx) => {
    logger.error(err)
  })

  app.listen(port, cb)
}
