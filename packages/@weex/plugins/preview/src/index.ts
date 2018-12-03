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

  async init(options: PreviewOptions) {
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
