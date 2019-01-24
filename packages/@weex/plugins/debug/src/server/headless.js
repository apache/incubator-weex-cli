const puppeteer = require('puppeteer')
let page
let browser = null
const { logger } = require('../util')

exports.launchHeadless = async (host, remotePort) => {
  browser = await puppeteer.launch({
    args: [`--remote-debugging-port=${remotePort}`, `--disable-gpu`]
  })
  logger.verbose(`Headless has been launched`)
  page = await browser.newPage()
  await page.setUserAgent(
    '5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
  )
  await page.goto(`http://${host}/runtime/runtime.html`)
  logger.verbose(`Headless page goto http://${host}/runtime/runtime.html`)
}

exports.closeHeadless = async () => {
  if (page) {
    await page.close()
  }
  if (browser) {
    await browser.close()
  }
  browser = null
  logger.verbose(`Cloased headless`)
}
