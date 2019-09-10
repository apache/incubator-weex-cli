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
import * as httpServer from 'http-server'

export interface HttpOptions {
  showDir: boolean
  autoIndex: boolean
  cache: string
  root: string
}

export class HttpServer {
  private server: any
  constructor(options: any) {
    this.server = this.startHttpServer(options)
  }

  startHttpServer(options: HttpOptions) {
    let server = httpServer.createServer(options)
    return server
  }

  async listen(port: number | string) {
    return new Promise((resolve, reject) => {
      this.server.listen(port, '0.0.0.0', data => {
        resolve(data)
      })
    })
  }
}

export default HttpServer
