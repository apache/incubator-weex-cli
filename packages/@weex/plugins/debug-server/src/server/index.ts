import * as path from 'path'
import * as koa from 'koa'
import * as koaStatic from 'koa-static'
import * as websockify from 'koa-websocket'
import * as bodyParser from 'koa-bodyparser'

import * as DEBUG from 'debug'
const debug = DEBUG('server')

import WSRouter from './routers/websocket'
import HttpRouter from './routers/http'
import { setup } from './setup'

export default {
  start: (port: string) => {
    return new Promise((resolve, reject) => {
      const event = setup(path.join(__dirname, '../handlers'))
      const app = websockify(new koa())
      const rootPath = path.join(__dirname, '../../runtime/')
      app.use(bodyParser())
      app.ws.use(WSRouter.routes()).use(WSRouter.allowedMethods())
      app.use(koaStatic(rootPath))
      app.use(HttpRouter.routes())
      app.on('error', (err, ctx) => {
        debug(`Error: ${err}`)
        reject(port)
      })
      let server = app.listen(port, () => {
        resolve({
          server,
          event,
        })
      })
    })
  },
}
