const EventEmitter = require('events').EventEmitter
const uuid = require('uuid')
const Promise = require('ipromise')
const { logger } = require('../../util')

class SyncTerminal extends EventEmitter {
  constructor () {
    super()
    this.id = uuid()
    this.promise = new Promise()
  }

  send (data) {
    this.emit('message', data)
    this.syncId = data.params.syncId
    return this.promise
  }

  read (message) {
    if (Array.isArray(message) && !message[0]) {
      message = [{}]
    }
    if (message.id && this.syncId === message.id) {
      this.promise.resolve(message)
    }
    else if (!message.id) {
      // while android sdk has not support, should return promise while getting message
      this.promise.resolve(message)
    }
    // never destory
    // cause the terminal will be destory before the socket send message
    // this.emit('destroy')
  }
}
class WebsocketTerminal extends EventEmitter {
  constructor (websocket, channelId) {
    super()
    this.channelId = channelId
    this.id = uuid()
    this.websocket = websocket
    websocket.on('connect', function () {})
    websocket.on('message', message => {
      this.emit('message', JSON.parse(message))
    })
    websocket.on('close', () => {
      this.emit('destroy')
    })
    websocket.on('error', err => {
      logger.error(err)
    })
  }

  read (message) {
    if (this.websocket.readyState === 1) {
      this.emit('read', message)
      this.websocket.send(JSON.stringify(message))
    }
  }
}
module.exports = { WebsocketTerminal, SyncTerminal }
