const invok = require('invok')
const Promise = require('ipromise')
class Filter {
  constructor (handler) {
    this.handler = handler
    this.isGeneratorFunction =
      Object.prototype.toString.call(handler) === '[object GeneratorFunction]'
  }
  run (message, next) {
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
}
function resolveFilterChain (message, filterChain, currentIndex = 0) {
  return filterChain[currentIndex].run(message, function () {
    return currentIndex + 1 < filterChain.length
      ? resolveFilterChain(message, filterChain, currentIndex + 1)
      : Promise.resolve()
  })
}
Filter.resolveFilterChain = resolveFilterChain
const filterChain = []
filterChain.push(
  new Filter(function (message, next) {
    message.from = 1
    message.to = 2
    next()
  })
)
filterChain.push(
  new Filter(function * (message, next) {
    message.data = 3
    yield next
  })
)
function delay (time) {
  const p = new Promise()
  setTimeout(() => p.resolve(), time)
  return p
}
filterChain.push(
  new Filter(function * (message, next) {
    yield delay(3000)
    message.data = 5
    yield next
  })
)
filterChain.push(
  new Filter(function (message, next) {
    setTimeout(function () {
      next()
    }, 1000)
  })
)
Filter.resolveFilterChain({}, filterChain).then(
  function (data) {
    console.log(2, data)
  },
  function (err) {
    console.log(err)
  }
)
