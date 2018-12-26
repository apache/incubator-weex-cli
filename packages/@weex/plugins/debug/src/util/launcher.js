const opn = require('opn')

const pendingList = []
let pending = false
const launchChrome = function (url, remoteDebugPort, wait, callback) {
  if (!pending) {
    pending = true
    url = url.replace(/[&*]/g, '\\&')
    const args = remoteDebugPort > 0 ? ['-remote-debugging-port=' + remoteDebugPort] : null
    opn(url, args, !!wait).then(cp => {
      cp.once('close', e => {
        callback && callback(null)
        if (pendingList.length > 0) {
          pending = false
          pendingList.shift()()
        }
      })
      cp.once('error', err => {
        pending = false
        callback && callback(err)
      })
    })
  }
  else {
    pendingList.push(function () {
      launchChrome(url, remoteDebugPort, wait, callback)
    })
  }
}

module.exports = {
  launchChrome
}
