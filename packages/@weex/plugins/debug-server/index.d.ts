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
interface DevtoolOptions {
  /**
   * 调试通道ID
   *
   * @type {string}
   * @memberof DevtoolOptions
   */
  channelId: string
  /**
   * 端口号
   *
   * @type {number}
   * @memberof DevtoolOptions
   */
  port: number
  /**
   * 服务IP
   *
   * @type {string}
   * @memberof DevtoolOptions
   */
  ip: string
  /**
   * chromium调试端口号
   *
   * @type {number}
   * @memberof DevtoolOptions
   */
  remoteDebugPort: number
  [key: string]: any
}

declare interface Devtool {
  static namespace: string[]
  /**
   * 关闭Devtool服务
   *
   * @memberof Devtool
   */
  close(): void
  /**
   * 监听调试消息，完整event可通过实例下的namespace属性获取
   * 如: Devtool.namespace
   *
   * @param {(string|Symbol)} event
   * @param {*} handler
   * @memberof Devtool
   */
  on(event: string | Symbol, handler: any)
  /**
   * 获取生成的socket地址
   *
   * @type {{
   *     entry: string
   *     inspector: string
   *     native: string
   *     debugger: string
   *     runtime: string
   *   }}
   * @memberof Devtool
   */
  socket: {
    entry: string
    inspector: string
    native: string
    debugger: string
    runtime: string
  }
  /**
   * 获取Runtime托管的地址
   *
   * @type {string}
   * @memberof Devtool
   */
  runtime: string
}

declare module '@weex-cli/debug-server' {
  /**
   * 用于启动Devtool服务接口
   *
   * @export
   * @param {DevtoolOptions} options
   * @returns {Devtool}
   */
  export function start(options: DevtoolOptions): Devtool
  /**
   * Devtool 类
   *
   * @export
   * @class Devtool
   */
  export class Devtool {
    static namespace: string[]
  }
}
