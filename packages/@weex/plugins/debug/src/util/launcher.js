const opn = require('opn')
const puppeteer = require('puppeteer')
const launchChrome = function (url) {
  opn(url, { app: puppeteer._launcher.executablePath() })
}

module.exports = {
  launchChrome
}
