const invok = require('invok')
const Promise = require('ipromise')
class Filter {
  constructor (handler, condition) {
    this.condition = condition
    this.handler = handler
    this.isGeneratorFunction =
      Object.prototype.toString.call(handler) === '[object GeneratorFunction]'
    if (typeof this.condition === 'string') {
      this.condition = new Function(
        'message',
        'with(message) {return ' + this.condition + ';}'
      )
    }
  }

  when (condition) {
    if (condition === 'string') {
      this.condition = new Function(
        'message',
        'with(message) {return ' + condition + ';}'
      )
    }
  }

  run (message, next) {
    if (!this.condition || this.condition(message)) {
      if (this.isGeneratorFunction) {
        return invok(this.handler, this, [message, next])
      }
      else {
        const p = new Promise()
        this.handler(message, function () {
          next().linkTo(p)
        })
        return p
      }
    }
    else {
      return next()
    }
  }
}
function resolveFilterChain (message, filterChain, currentIndex = 0) {
  return filterChain[currentIndex].run(message, function () {
    return currentIndex + 1 < filterChain.length
      ? resolveFilterChain(message, filterChain, currentIndex + 1)
      : Promise.resolve()
  })
}
Filter.resolveFilterChain = resolveFilterChain
module.exports = Filter
