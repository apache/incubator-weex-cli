const Koa = require('koa')
const http = require('http')
const WebSocket = require('ws')
const serve = require('koa-static')
const kill = require('kill-port')
const debug = require('debug')('run')
const address = require('address')
const detect = require('detect-port')

export default class WsServer {
  private port: number | null
  private hostname: string | null
  private staticFolder: string | null
  private ws

  constructor(options?: { defaultPort?: number; staticFolder?: string }) {
    // Do nothing
    const { defaultPort, staticFolder } = Object.assign(
      {
        defaultPort: 9090,
        staticFolder: null,
      },
      options,
    )

    this.port = defaultPort
    this.staticFolder = staticFolder
  }

  async getPort() {
    try {
      this.port = await detect(this.port)
    } catch (e) {
      this.port = Number(this.port) + 1
    }
  }

  getHost() {
    this.hostname = address.ip()
  }

  public async init() {
    const app = new Koa()
    const that = this
    const server = http.createServer(app.callback())
    const wss = new WebSocket.Server({ server })
    wss.on('connection', function connection(ws) {
      debug('ws connection')
      that.ws = ws
    })
    this.setStaticFolder(app)
    await this.getPort()
    this.getHost()
    server.listen(
      {
        port: this.port,
        host: this.hostname,
      },
      function listening() {
        debug('Listening on %d', server.address().port)
      },
    )
  }

  public getWs() {
    return this.ws
  }

  public getServerInfo() {
    return {
      port: this.port,
      hostname: this.hostname,
    }
  }

  private setStaticFolder(app) {
    const staticFolder = this.staticFolder
    if (!staticFolder) {
      return console.warn('No staticFolder set!')
    }
    app.use(serve(staticFolder))
  }

  public dispose() {
    kill(this.port)
  }
}
