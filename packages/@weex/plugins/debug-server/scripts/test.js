const devtool = require('../index')
const ip = require('ip').address()
const puppeteer = require('puppeteer')
const start = async () => {
  const channelId = 1000
  const remoteDebugPort = '9223'
  const Devtool = await devtool.start({
    channelId: channelId,
    port: 8099,
    ip: ip,
    remoteDebugPort: remoteDebugPort
  })
  // Devtool.close()
  Devtool.on('proxy.native', message => {
    // console.log(message)
  })
  Devtool.on('runtime.worker', message => {
    // console.log(message)
  })
  browser = await puppeteer.launch({
    args: [`--remote-debugging-port=${remoteDebugPort}`, `--disable-gpu`],
  })
  page = await browser.newPage()
  await page.setUserAgent(
    '5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
  )
  await page.goto(`${Devtool.runtime}?channelId=${channelId}`)
  console.log('Sockets:', Devtool.socket)
  return Devtool
}

start()

// const start2 = async () => {
//   let origin = 'ladder.alibaba.com'
//   let channelId = 1001
//   const Devtool = await devtool.start({
//     channelId: channelId,
//     port: 8027,
//     ip: ip
//   })
//   console.log(Devtool.socket)
//   // Devtool.close()
//   return Devtool
// }

// start2()