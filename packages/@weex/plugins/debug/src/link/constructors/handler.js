const Promise = require('ipromise')
class Handler {
  constructor (handler, router) {
    this.handler = handler
    this.router = router
  }

  at (fromString) {
    this.fromString = fromString
    return this
  }

  when (condition) {
    if (typeof condition === 'string') {
      this.condition = new Function(
        'message',
        'with(message) {return ' + condition + ';}'
      )
    }
    else if (typeof condition === 'function') {
      this.condition = condition
    }
    return this
  }

  test (message) {
    return (
      message.match(this.fromString) &&
      (!this.condition || this.condition(message))
    )
  }

  run (message) {
    if (this.test(message)) {
      return this.handler.call(this.router, message)
    }
  }
}
function _run (handlerList, message, i = 0) {
  const promise = new Promise()
  const handler = handlerList[i]
  if (handler) {
    const ret = handler.run(message)
    if (ret && typeof ret.then === 'function') {
      if (i + 1 < handlerList.length) {
        ret.then(function (data) {
          if (data === false) {
            promise.resolve(false)
          }
          else {
            promise.resolve(_run(handlerList, data || message, i + 1))
          }
        })
      }
      else {
        return ret
      }
    }
    else if (ret === false) {
      promise.resolve(ret)
    }
    else {
      if (i + 1 < handlerList.length) {
        promise.resolve(_run(handlerList, ret || message, i + 1))
      }
      else {
        promise.resolve(ret)
      }
    }
  }
  else {
    promise.resolve()
  }
  return promise
}
Handler.run = _run
module.exports = Handler
