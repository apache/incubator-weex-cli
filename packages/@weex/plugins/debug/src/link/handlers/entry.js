const mlink = require('../index')
const config = require('../../config')
const Router = mlink.Router
const { util } = require('../../util')
const debuggerRouter = Router.get('debugger')
const opn = require('opn')

debuggerRouter
  .registerHandler(message => {
    let method = message.payload.method
    if (method === 'WxDebug.applyChannelId') {
      const channelId = debuggerRouter.newChannel(config.CHANNELID)
      message.payload = {
        method: 'WxDebug.pushChannelId',
        params: {
          channelId,
          connectUrl: util.getConnectUrl(channelId),
          bundles: config.bundles || []
        }
      }
      message.reply()
    }
    else if (method === 'WxDebug.queryServerVersion') {
      let pkg = require('../../../package.json')
      debuggerRouter.pushMessage('page.entry', {
        method: 'WxDebug.pushServerVersion',
        params: {
          version: pkg.version
        }
      })
      message.discard()
    }
    else if (method === 'WxDebug.openFile') {
      opn(message.payload.params)
    }
  })
  .at('page.entry')
