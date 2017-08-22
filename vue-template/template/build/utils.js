var path = require('path')

module.exports = {
  resolve: function (rel) {
    return path.resolve(__dirname, '../', rel)
  }
}
