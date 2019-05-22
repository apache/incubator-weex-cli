# @weex-cli/debug-server

Remote debug server for Weex Debug.

## index.d.ts

```

interface DevtoolOptions {
  channelId: string
  port: number
  ip: string
  [key: string]: any
}

interface Devtool extends EventEmitter {
  /**
   * 关闭Devtool服务
   *
   * @memberof Devtool
   */
  close ():void
  /**
   * 获取生成的socket地址
   *
   * @type {{
   *     entry: string
   *     inspector: string
   *     native: string
   *     debugger: string
   *   }}
   * @memberof Devtool
   */
  socket: {
    entry: string
    inspector: string
    native: string
    debugger: string
  }
  /**
   * 获取Runtime托管的地址
   *
   * @type {string}
   * @memberof Devtool
   */
  runtime: string
}

declare module '@ali/switchboard' {
  /**
   * 用于启动Devtool服务接口
   *
   * @export
   * @param {DevtoolOptions} options
   * @returns {Devtool}
   */
  export function start (options: DevtoolOptions): Devtool
}
```