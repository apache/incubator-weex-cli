const protocols = {
  'http:': require('http'),
  'https:': require('https')
}
const URL = require('url')
const getRemote = function getRemote (url) {
  return new Promise(function (resolve, reject) {
    const urlObj = URL.parse(url)
    ;(protocols[urlObj.protocol] || protocols['http:'])
      .get(
        {
          hostname: urlObj.hostname,
          port: urlObj.port,
          path: urlObj.path,
          method: 'GET',
          headers: {
            'User-Agent': 'Weex/1.0.0'
          }
        },
        function (res) {
          let chunks = []
          res.on('data', function (chunk) {
            chunks.push(chunk)
          })
          res.on('end', function () {
            resolve(Buffer.concat(chunks).toString())
            chunks = null
          })
        }
      )
      .on('error', function (e) {
        reject(e)
      })
  })
}

module.exports = {
  getRemote
}
