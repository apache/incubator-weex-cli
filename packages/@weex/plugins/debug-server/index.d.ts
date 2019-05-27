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
