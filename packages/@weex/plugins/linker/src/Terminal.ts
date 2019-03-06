import * as DEBUG from 'debug'
const debug = DEBUG('terminal')

import * as uuid from 'uuid'
import * as EventEmitter from 'events'

export enum TerminalEvent {
  TERMINAL_DESTROY = 'TerminalDestroy',
  TERMINAL_ERROR = 'TerminalError',
  TERMINAL_MESSAGE = 'TerminalMessage',
  TERMINAL_CONNECTED = 'TerminalConnected'
}
class SyncTerminal extends EventEmitter {
  private promise: any
  private resolve: any
  private syncId: string
  channelId: string
  id: string

  constructor() {
    super()
    this.id = uuid()
    this.promise = new Promise(resolve => {
      this.resolve = resolve
    })
  }

  send(data: any) {
    this.emit(TerminalEvent.TERMINAL_MESSAGE, data)
    this.syncId = data.params.syncId
    return this.promise
  }

  read(message: any) {
    if (Array.isArray(message) && !message[0]) {
      message = [{}]
    }
    if (message.id && this.syncId === message.id) {
      this.resolve(message)
    } else if (!message.id) {
      // while android sdk has not support, should return promise while getting message
      this.resolve(message)
    }
    // never destroy
    // cause the terminal will be destroy before the socket send message
    // this.emit('destroy')
  }
}

class WebsocketTerminal extends EventEmitter {
  private websocket: any
  channelId: string
  id: string
  constructor(websocket: any, channelId: string = '') {
    super()
    this.channelId = channelId
    this.id = uuid()
    this.websocket = websocket
    websocket.on('connect', () => {
      debug(`${channelId} socket conneted`)
      this.emit(TerminalEvent.TERMINAL_CONNECTED)
    })
    websocket.on('message', message => {
      try {
        message = JSON.parse(message)
      } catch (error) {
        debug(`Error: ${error}`)
      }
      this.emit(TerminalEvent.TERMINAL_MESSAGE, message)
    })
    websocket.on('close', () => {
      this.emit(TerminalEvent.TERMINAL_DESTROY)
    })
    websocket.on('error', error => {
      this.emit(TerminalEvent.TERMINAL_ERROR)
      debug(`${channelId} socket error: ${error}`)
    })
    websocket.on('pong', () => {
      debug(`${channelId} ping-pong`)
    })
  }

  read(message: any) {
    if (this.websocket.readyState === 1) {
      this.emit('read', message)
      if (message === 'ping') {
        this.websocket.ping()
      } else {
        this.websocket.send(JSON.stringify(message))
      }
    }
  }
}

export default {
  WebsocketTerminal,
  SyncTerminal,
}
