const { generator, clone, getOptions } = require('../index')

module.exports = context => {
  context.generator = {
    render: generator,
    clone,
    getOptions
  }
}