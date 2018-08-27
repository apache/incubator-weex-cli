const fs = require('fs')
const path = require('path')
const Router = require('../constructors/router')
const Hub = require('../constructors/hub')
module.exports = function loader (dir, config = {}) {
  require(path.join(dir, config.linkPath || 'setup.js'))
  const handlerPath = path.join(dir, config.handlerPath || 'handlers')
  fs.readdirSync(handlerPath).forEach(file => {
    require(path.join(handlerPath, file))
  })
  Router.check()
  Hub.check()
}
