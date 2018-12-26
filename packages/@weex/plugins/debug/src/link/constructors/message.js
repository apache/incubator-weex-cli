let _uuid = 0
let _messageBuffer = []
const tools = require('../tools')
const { logger } = require('../../util')

class Message {
  constructor (payload, hubId, terminalId, channelId) {
    this._from = {
      hubId,
      terminalId
    }
    this.channelId = channelId
    this._to = []
    this.destination = []
    this.id = _uuid++
    _messageBuffer.push(this)
    this._payload = [payload]
    this._createTime = new Date()
  }

  get payload () {
    return this._payload[0]
  }

  set payload (value) {
    this._payload.unshift(value)
  }

  reply () {
    this.to(this._from.hubId, this._from.terminalId)
  }

  match (fromString) {
    return (
      !fromString ||
      tools.matchHubId(
        fromString,
        this._from.hubId + '.' + this._from.terminalId
      )
    )
  }

  to (hubId, terminalId) {
    this._to.push({
      hubId,
      terminalId
    })
  }

  discard () {
    this._discard = true
    this.destroy()
  }

  destroy () {
    if (this._discard) {
      logger.verbose(
        `${this.id}#[${this._from.hubId}@${
          this._from.terminalId.split('-')[0]
        }-${this.channelId ? this.channelId.split('-')[0] : '*'}] discard`,
        this._payload.length > 1 ? this._payload : this.payload
      )
    }
    _messageBuffer = _messageBuffer.filter(m => m.id !== this.id)
  }

  isAlive () {
    return !this._discard
  }

  route (resolver) {
    this.routed = true
    if (this._to.length === 0 && this.channelId) {
      // todo 如果没有明确的to但是有channelId 该当如何
      this._to.push({})
    }
    this.destination = []
    this._to.forEach(to => {
      if (!to.terminalId && resolver) {
        this.destination.push.apply(
          this.destination,
          resolver(this._from, to, this.channelId)
        )
      }
      else {
        this.destination.push(to)
      }
    })
  }

  selectOne (to) {
    let found = false
    for (let i = 0; i < this._to.length; i++) {
      if (
        this._to[i].hubId === to.hubId &&
        this._to[i].terminalId === to.terminalId
      ) {
        this._to.splice(i, 1)
        found = true
        break
      }
    }
    if (found) {
      const selected = new Message(
        this.payload,
        this._from.hubId,
        this._from.terminalId,
        this.channelId
      )
      selected._to = [to]
      return selected
    }
    else {
      throw new Error('message select not found')
    }
  }
}
module.exports = Message
