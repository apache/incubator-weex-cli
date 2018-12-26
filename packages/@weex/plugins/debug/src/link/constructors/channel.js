const uuid = require('uuid')
const CHANNEL_MODE = require('./enum').CHANNEL_MODE
const tools = require('../tools')
class Channel {
  constructor (channelId, mode, enableMulticast) {
    this.hubMap = {}
    this.mode = mode
    this.id = channelId || uuid()
    this.cache = []
    this.enableMulticast = enableMulticast
  }

  getTerminal (hubId) {
    return this.hubMap[hubId]
  }

  findAll () {
    return Object.keys(this.hubMap).map(hid => ({
      hubId: hid,
      terminalId: this.hubMap[hid]
    }))
  }

  findOthers (hubId, terminalId, toHubId) {
    if (hubId === toHubId) {
      throw new Error('hubId must be different from toHubId')
    }
    else if (!this.has(hubId, terminalId) && !toHubId) {
      throw new Error(
        'terminal [' +
          hubId +
          '.' +
          (terminalId || '*') +
          '] is not in this chanel !'
      )
    }
    else {
      const keys = Object.keys(this.hubMap)
      if (keys.length > 2 && !this.enableMulticast && !toHubId) {
        // channel中有超过三个hub的时候则默认不支持多播
        return []
      }
      return keys
        .filter(
          hid => hid !== hubId && (!toHubId || tools.matchHubId(toHubId, hid))
        )
        .map(hid => ({ hubId: hid, terminalId: this.hubMap[hid] }))
    }
  }

  pushCache (message) {
    this.cache.push(message)
  }

  has (hubId, terminalId) {
    return (
      this.hubMap[hubId] &&
      (!terminalId || this.hubMap[hubId].indexOf(terminalId) >= 0)
    )
  }

  getCache (hubId) {
    const hit = []
    const notHit = []
    this.cache.forEach(c => {
      if (c._to.length > 0) {
        if (
          c._from.hubId !== hubId &&
          (!c._to[0].hubId || tools.matchHubId(c._to[0].hubId, hubId))
        ) {
          hit.push(c)
        }
        else {
          notHit.push(c)
        }
      }
    })
    if (hit.length > 0) {
      this.cache = notHit
    }
    return hit
  }

  join (hubId, terminalId, forced) {
    // change: forced can be removed
    // cause the hubMap should be {[key:string]: string[]}
    if (this.hubMap[hubId]) {
      if (forced) {
        this.hubMap[hubId] = [terminalId]
      }
      else {
        if (this.hubMap[hubId].indexOf(terminalId) === -1) {
          this.hubMap[hubId].push(terminalId)
        }
        else {
          this.hubMap[hubId] = [terminalId]
        }
      }
    }
    else {
      const hubIds = Object.keys(this.hubMap)
      if (this.mode === CHANNEL_MODE.P2P && hubIds.length >= 2) {
        throw new Error('A channel can just link two hub in p2p mode')
      }
      this.hubMap[hubId] = [terminalId]
    }
  }

  leave (hubId, terminalId) {
    if (this.has(hubId, terminalId) && Array.isArray(this.hubMap[hubId])) {
      this.cache = this.cache.filter(
        c => c.hubId !== hubId || (terminalId && c.terminalId !== terminalId)
      )
      let index = this.hubMap[hubId].indexOf(terminalId)
      if (index) {
        this.hubMap[hubId].splice(index, 1)
      }
    }
  }
}

module.exports = Channel
