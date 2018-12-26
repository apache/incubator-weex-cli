const Filter = require('./filter')
const Router = require('./router')
const Message = require('./message')
const { logger } = require('../../util')
const _hubInstances = {}
class Hub {
  constructor (id) {
    const self = this
    if (_hubInstances[id]) {
      return _hubInstances[id]
    }
    _hubInstances[id] = this
    this.id = id
    this.terminalMap = {}
    this.filterChain = []
    this._pushToRouter = new Filter(function * (message) {
      const responseMessage = yield self.router._fetchMessage(message)
      self.response = responseMessage
      return responseMessage
    })
  }

  static get (id) {
    return _hubInstances[id] || new Hub(id)
  }

  static check () {
    Object.keys(_hubInstances).forEach(id => {
      if (!_hubInstances[id].router) {
        console.warn(
          'mlink warning: Hub[' +
            id +
            '] not join in any router.make sure your id is correct'
        )
      }
    })
  }

  join (terminal, forced) {
    if (!this.router) {
      throw new Error(
        'A Hub must be linked with a Router before join terminals'
      )
    }
    if (!this.terminalMap[terminal.id]) {
      terminal.hub = this.id
      this.terminalMap[terminal.id] = terminal
      this._setupTerminal(terminal, forced)
    }
    else {
      throw new Error('can not add the same port')
    }
  }

  setChannel (terminalId, channelId) {
    if (this.terminalMap[terminalId]) {
      this.terminalMap[terminalId].channelId = channelId
    }
    else {
      throw new Error('can not find terminal[' + terminalId + ']')
    }
  }

  _setupTerminal (terminal, forced) {
    terminal.on('destroy', () => {
      if (this.terminalMap[terminal.id]) {
        delete this.terminalMap[terminal.id]
        this.router._event({
          type: Router.Event.TERMINAL_LEAVED,
          terminalId: terminal.id,
          hubId: this.id,
          channelId: terminal.channelId
        })
        terminal = null
      }
      else {
        logger.warn('try to delete a non-exist terminal')
      }
    })
    terminal.on('message', message => {
      this.send(new Message(message, this.id, terminal.id, terminal.channelId))
    })

    this.router._event({
      type: Router.Event.TERMINAL_JOINED,
      terminalId: terminal.id,
      hubId: this.id,
      channelId: terminal.channelId,
      forced: forced
    })
  }

  broadcast (message) {
    for (const id in this.terminalMap) {
      if (this.terminalMap.hasOwnProperty(id)) {
        this.terminalMap[id].read(message.payload)
      }
    }
    message.destroy()
  }

  pushToTerminal (terminalId, message) {
    if (this.terminalMap[terminalId]) {
      this.terminalMap[terminalId].read(message.payload)
    }
    else {
      // logger.verbose(new Error("Terminal [" + terminalId + "] not found! @" + this.id));
    }
  }

  send (message) {
    if (!this.router) {
      throw new Error('this hub not linked with a router,message send failed!')
    }
    Filter.resolveFilterChain(
      message,
      this.filterChain.concat(this._pushToRouter)
    )
      .then(() => {})
      .catch(e => logger.error(e))
  }

  filter (filter, condition) {
    this.filterChain.push(new Filter(filter, condition))
  }
}
module.exports = Hub
