const tools = require('../tools')
class Emitter {
  constructor () {
    this._eventHandler = {}
  }

  on (event, namespace, handler) {
    if (arguments.length === 2) {
      handler = namespace
      namespace = ''
    }
    if (!this._eventHandler[event]) {
      this._eventHandler[event] = {}
    }

    const target = tools.objectLocate(this._eventHandler[event], namespace)

    if (target.__handlers__) {
      target.__handlers__.push(handler)
    }
    else {
      target.__handlers__ = [handler]
    }
  }

  off (event, namespace) {
    if (this._eventHandler[event]) {
      if (!namespace) {
        this._eventHandler[event] = {}
      }
      else {
        tools.clearObjectAt(this._eventHandler[event], namespace)
      }
    }
  }

  emit (event, namespace, data) {
    if (arguments.length === 2) {
      data = namespace
      namespace = ''
    }
    if (this._eventHandler[event]) {
      const context = {
        namespace,
        event,
        path: namespace
      }
      return this._emit(this._eventHandler[event], namespace, context, data)
    }
    else {
      return false
    }
  }

  _emit (prevTarget, namespace, context, data) {
    context.path = namespace
    const target = tools.objectGet(prevTarget, namespace)
    if (target && target.__handlers__) {
      target.__handlers__.forEach(h => h.call(context, data))
    }
    else {
      if (namespace) {
        const ns = namespace.substr(0, namespace.lastIndexOf('.'))
        return this._emit(prevTarget, ns, context, data)
      }
      else {
        return false
      }
    }
  }

  broadcast (event, namespace, data) {
    if (arguments.length === 2) {
      data = namespace
      namespace = ''
    }
    if (this._eventHandler[event]) {
      const target = tools.objectGet(this._eventHandler[event], namespace)
      if (target) {
        const context = { event, namespace, path: namespace }
        this._broadcast(target, context, data)
        return true
      }
      else return false
    }
    else {
      return false
    }
  }

  _broadcast (target, context, data) {
    target.__handlers__ &&
      target.__handlers__.forEach(h => h.call(context, data))
    const keys = Object.keys(target).filter(k => k !== '__handlers__')

    keys.forEach(k => {
      const ctx = {
        event: context.event,
        namespace: context.namespace,
        path: context.namespace + '.' + k
      }
      this._broadcast(target[k], ctx, data)
    })
  }
}
module.exports = Emitter
