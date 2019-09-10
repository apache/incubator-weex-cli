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
import HttpServer from './HttpServer'
import HotReloadServer from './HotReloadServer'
import * as path from 'path'

export interface PreviewOptions {
  staticSourceLocation?: string
  port: number
  wsport: number
}

export class Previewer {
  public httpServer: any = null
  public hotReloadServer: any = null
  public defaultFrontendLocation: string = path.join(__dirname, '../frontend/preview')
  constructor(options: PreviewOptions) {
    this.init(options)
  }

  init(options: PreviewOptions) {
    /* tslint:disable */

    this.initServer(options)
  }

  async initServer(options: PreviewOptions) {
    this.httpServer = new HttpServer({
      root: options.staticSourceLocation || this.defaultFrontendLocation,
      cache: '-1',
      showDir: true,
      autoIndex: true,
    })
    await this.httpServer.listen(options.port)
    this.hotReloadServer = new HotReloadServer({
      port: options.wsport,
    })
  }
}
