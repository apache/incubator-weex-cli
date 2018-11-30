import * as WebSocket from 'ws'
import * as http from 'http'
import * as DEBUG from 'debug'

const debug = DEBUG('weex:preview')

export interface PerMessageDeflateOptions {
  serverNoContextTakeover?: boolean
  clientNoContextTakeover?: boolean
  serverMaxWindowBits?: number
  clientMaxWindowBits?: number
  zlibDeflateOptions?: {
      flush?: number;
      finishFlush?: number;
      chunkSize?: number;
      windowBits?: number;
      level?: number;
      memLevel?: number;
      strategy?: number;
      dictionary?: Buffer | Buffer[] | DataView;
      info?: boolean;
  }
  threshold?: number
  concurrencyLimit?: number
}

type CertMeta = string | string[] | Buffer | Buffer[]

export interface ClientOptions {
  protocol?: string
  handshakeTimeout?: number
  perMessageDeflate?: boolean | PerMessageDeflateOptions
  localAddress?: string
  protocolVersion?: number
  headers?: { [key: string]: string }
  origin?: string
  agent?: http.Agent
  host?: string
  family?: number
  checkServerIdentity?(servername: string, cert: CertMeta): boolean
  rejectUnauthorized?: boolean
  passphrase?: string
  ciphers?: string
  cert?: CertMeta
  key?: CertMeta
  pfx?: string | Buffer
  ca?: CertMeta
  maxPayload?: number
  port?: number | string
}

export class HotReloadServer {
  public clients: any[]
  public wss: any
  constructor (options: ClientOptions) {
    this.clients = []
    this.wss = this.startWebSocket(options)
  }

  startWebSocket(options: ClientOptions) {
    const wss = new WebSocket.Server(options)
    wss.on('connection', (ws) => {
      this.clients.push(ws)
      ws.on('message', (message) => {
        this.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send('websocket connected', (err) => {
              if (err) {
                debug(err)
              }
            })
          }
        })
      })
      // while socket recive close or error sigle, socket destroy and remve client from clients
      // websocket close handle
      ws.on('close', (data) => {
        debug('websocket close -> ', data)
        if (ws && ws.upgradeReq) {
          this.clients.splice(this.findClient(ws.upgradeReq.url))
        }
        ws._socket.destroy()
        ws.close()
      })
      // websocket error handle
      ws.on('error', (error) => {
        if (error) {
          debug('websocket error -> ', error)
          if (ws && ws.upgradeReq) {
            this.clients.splice(this.findClient(ws.upgradeReq.url), 1)
          }
          ws._socket.destroy()
          ws.close()
        }
      })
    })
    return wss
  }

  // send web socket messsage to client
  async sendSocketMessage(message: string) {
    new Promise((resolve, reject) => {
      this.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message || 'refresh', (err: Error) => {
            if (err) {
              debug('sending websocket message error -> ', err)
              reject(err)
            } else {
              resolve('success')
            }
          })
        }
      })
    })
  }

  // find client through request url
  private findClient(url: string) {
    for (let i = 0; i < this.clients.length; i++) {
      if (this.clients[i].upgradeReq.url === url) {
        return i
      }
    }
    return null
  }
}

export default HotReloadServer