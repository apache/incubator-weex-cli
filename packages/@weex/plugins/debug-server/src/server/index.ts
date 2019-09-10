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
