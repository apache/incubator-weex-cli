import * as DEBUG from 'debug'
const debug = DEBUG('message')

import utils from './utils'

interface FromType {
  hubId: string
  terminalId: string
}

interface ToType {
  hubId: string
  terminalId: string
}

export default class Message {
  private uuid: number = 0
  private id: number = 0
  private _discard: boolean = false
  private _destroy: boolean = false
  private _destination: any[]
  routed: boolean = false
  createTime: Date
  channelId: string
  terminalId: string
  payload: any
  _from: FromType
  _to: ToType[]

  constructor(payload: any, hubId: any, terminalId: string, channelId: string = 'unknown') {
    this.channelId = channelId
    this.terminalId = terminalId
    this._from = {
      hubId,
      terminalId,
    }
    this._to = []
    this._destination = []
    this.id = this.uuid++
    this.payload = payload
    this.createTime = new Date()
  }

  get destination() {
    return this._destination
  }

  reply() {
    this.to(this._from.hubId, this._from.terminalId)
  }

  match(fromString) {
    return !fromString || utils.matchHubId(fromString, this._from.hubId + '.' + this._from.terminalId)
  }

  to(hubId: string, terminalId: string = '') {
    this._to.push({
      hubId,
      terminalId,
    })
  }

  discard() {
    debug(`Message ${this.id} discard`)
    this._discard = true
  }

  destroy() {
    debug(`Message ${this.id} destroy`)
    this._destroy = true
  }

  isAlive() {
    return !this._discard
  }

  route(resolver?: any) {
    this.routed = true
    if (this._to.length === 0 && this.channelId) {
      // todo 如果没有明确的to但是有channelId 该当如何
      // this._to.push({})
    }
    this._destination = []
    this._to.forEach(to => {
      if (!to.terminalId && resolver) {
        this._destination.push.apply(this._destination, resolver(this._from, to, this.channelId))
      } else {
        this._destination.push(to)
      }
    })
  }

  selectOne(to: ToType) {
    let found = false
    for (let i = 0; i < this._to.length; i++) {
      if (this._to[i].hubId === to.hubId && this._to[i].terminalId === to.terminalId) {
        this._to.splice(i, 1)
        found = true
        break
      }
    }
    if (found) {
      const selected: Message = new Message(this.payload, this._from.hubId, this._from.terminalId, this.channelId)
      selected.to(to.hubId, to.terminalId)
      return selected
    } else {
      throw new Error('message select not found')
    }
  }
}
