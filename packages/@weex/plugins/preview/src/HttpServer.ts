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
