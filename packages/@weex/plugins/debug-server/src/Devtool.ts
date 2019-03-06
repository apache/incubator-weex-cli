import * as EventEmitter from 'events'
import { Router, Emitter, Message } from '@weex-cli/linker'

export default class Devtool extends EventEmitter {
  static namespace = [
    'proxy.native',
    'page.debugger',
    'proxy.inspector',
    'runtime.worker',
    'page.entry',
    'runtime.proxy',
    'sync.native',
    'sync.v8',
    Router.HubId,
  ]
  private _server: any = null
  private _socket: any = null
  private _runtime: any = null

  constructor(server: any, socket: any, runtime: any, event?: Emitter) {
    super()
    this._server = server
    this._socket = socket
    this._runtime = runtime
    event && this.handlerEvent(event)
  }

  close() {
    this._server && this._server.close()
  }

  get socket() {
    return this._socket
  }

  get runtime() {
    return this._runtime
  }

  private handlerEvent(event: Emitter) {
    Devtool.namespace.forEach((ns: string) => {
      event.on(Router.Event.TERMINAL_LEAVED, ns, (message: Message) => {
        this.emit(ns, { type: Router.Event.TERMINAL_LEAVED, data: message })
      })
      event.on(Router.Event.TERMINAL_JOINED, ns, (message: Message) => {
        this.emit(ns, { type: Router.Event.TERMINAL_JOINED, data: message })
      })
      event.on(Router.Event.MESSAGE_RECEIVED, ns, (message: Message) => {
        this.emit(ns, { type: Router.Event.MESSAGE_RECEIVED, data: message })
      })
    })
  }
}
