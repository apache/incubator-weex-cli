const Channel = require('./channel')
const Handler = require('./handler')
const Emitter = require('./emitter')
const Message = require('./message')
const { logger } = require('../../util')

const _routerInstances = {}
class Router extends Emitter {
  constructor (id) {
    super()
    if (_routerInstances[id]) {
      return _routerInstances[id]
    }
    this.hubs = {}
    this.id = id
    this.channelMap = {}
    this.handlerList = []
    _routerInstances[id] = this
  }
  static check () {
    Object.keys(_routerInstances).forEach(id => {
      if (Object.keys(_routerInstances[id].hubs).length === 0) {
        logger.warn(
          '[Mlink Warning] Router[' +
            id +
            '] do not has any hub.make sure your id is correct'
        )
      }
    })
  }
  static get (id) {
    return _routerInstances[id] || new Router(id)
  }
  static dump () {
    Object.keys(_routerInstances).forEach(id => {
      const router = _routerInstances[id]
      for (const hid in router.hubs) {
        logger.log('Router[' + id + ']' + '<---->' + 'Hub[' + hid + ']')
      }
    })
  }
  link (hub) {
    this.hubs[hub.id] = hub
    hub.router = this
  }
  reply (message, payload) {
    this.pushMessage(message._from.hubId, message._from.terminalId, payload)
  }
  newChannel (channelId, mode) {
    const channel = new Channel(channelId, mode)
    this.channelMap[channel.id] = channel
    return channel.id
  }
  // fixme
  pushMessageByChannelId (hubId, channelId, payload) {
    const message = new Message(payload, 'unknown', 'unknown', channelId)
    message.to(hubId)
    message.route()
    this._fetchMessage(message)
  }
  pushMessage (hubId, terminalId, payload) {
    if (arguments.length === 2) {
      payload = terminalId
      if (typeof hubId === 'string') {
        ;[hubId, terminalId] = hubId.split('@')
      }
      else if (typeof hubId === 'object') {
        hubId = hubId.hubId
        terminalId = hubId.terminalId
      }
      else {
        logger.error(
          'the first argument of pushMessage must be a string or object'
        )
      }
    }
    const message = new Message(payload, 'unknown', 'unknown')
    message.to(hubId, terminalId)
    message.route()
    this._pushMessage(message)
  }
  _pushMessage (message) {
    message.destination.forEach(dest => {
      if (this.hubs[dest.hubId]) {
        if (Array.isArray(dest.terminalId) && dest.terminalId.length > 0) {
          dest.terminalId.forEach(terminal => {
            this.hubs[dest.hubId].pushToTerminal(terminal, message)
          })
        }
        else if (typeof dest.terminalId === 'string' && dest.terminalId) {
          this.hubs[dest.hubId].pushToTerminal(dest.terminalId, message)
        }
        else {
          this.hubs[dest.hubId].broadcast(message)
        }
      }
      else {
        logger.error(new Error('Hub [' + dest.hubId + '] not found!'))
      }
    })
    message.destroy()
  }
  _dispatchMessage (message) {
    if (message.isAlive()) {
      message.route((from, to, channelId) => {
        if (channelId) {
          const channel = this.channelMap[channelId]
          if (channel) {
            const others = channel.findOthers(
              from.hubId,
              from.terminalId,
              to.hubId
            )
            if (others.length === 0) channel.pushCache(message.selectOne(to))
            return others
          }
          else {
            // logger.warn(
            //   `There should be a connection that request to a close device, invalid channelId: ${channelId}`
            // );
          }
        }
        else {
          logger.error(new Error('invalid message no channelId'))
        }
      })
      this._pushMessage(message)
    }
  }
  _fetchMessage (message) {
    // Handler.run(this.handlerList)
    this.emit(
      Router.Event.MESSAGE_RECEIVED,
      message._from.hubId + '.' + message._from.terminalId,
      message
    )
    return Handler.run(this.handlerList, message)
      .then(data => {
        // todo 如何保证消息的顺序
        this._dispatchMessage(message)
      })
      .catch(e => {
        logger.error(e)
      })
  }
  registerHandler (handler) {
    const currentHandler = new Handler(handler, this)
    this.handlerList.push(currentHandler)
    return currentHandler
  }
  _event (signal) {
    switch (signal.type) {
      case Router.Event.TERMINAL_JOINED:
        logger.verbose(`[terminal]${signal.hubId}-${signal.terminalId} joined`)
        if (signal.channelId) {
          const channel = this.channelMap[signal.channelId]
          if (channel) {
            logger.verbose(
              `[channel]${signal.hubId}-${signal.terminalId} join channel ${
                signal.channelId
              }`
            )
            channel.join(signal.hubId, signal.terminalId, signal.forced)

            const cacheMessages = channel.getCache(
              signal.hubId,
              signal.terminalId
            )
            cacheMessages.forEach(m => this._dispatchMessage(m))
          }
        }
        this.emit(
          Router.Event.TERMINAL_JOINED,
          signal.hubId + '.' + signal.terminalId,
          signal
        )
        break
      case Router.Event.TERMINAL_LEAVED:
        logger.verbose(`[terminal]${signal.hubId}-${signal.terminalId} leaved`)
        if (signal.channelId) {
          const channel = this.channelMap[signal.channelId]
          if (channel) {
            logger.verbose(
              `[channel]${signal.hubId}-${signal.terminalId} leave channel ${
                signal.channelId
              }`
            )
            channel.leave(signal.hubId, signal.terminalId)
          }
        }
        this.emit(
          Router.Event.TERMINAL_LEAVED,
          signal.hubId + '.' + signal.terminalId,
          signal
        )
        break
    }
  }
}

Router.Event = {
  TERMINAL_JOINED: 0,
  TERMINAL_LEAVED: 1,
  MESSAGE_RECEIVED: 2
}

module.exports = Router
