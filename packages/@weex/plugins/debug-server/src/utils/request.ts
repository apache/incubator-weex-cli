import * as http from 'http'
import * as https from 'https'
import * as url from 'url'

const protocols = {
  'http:': http,
  'https:': https,
}

export const getRemote = remoteUrl => {
  return new Promise(function(resolve, reject) {
    const urlObj = url.parse(remoteUrl)
    ;(protocols[urlObj.protocol] || protocols['http:'])
      .get(
        {
          hostname: urlObj.hostname,
          port: urlObj.port,
          path: urlObj.path,
          method: 'GET',
          headers: {
            'User-Agent': 'Weex/1.0.0',
          },
        },
        res => {
          let chunks = []
          res.on('data', function(chunk) {
            chunks.push(chunk)
          })
          res.on('end', function() {
            resolve(Buffer.concat(chunks).toString())
            chunks = null
          })
        },
      )
      .on('error', e => {
        reject(e)
      })
  })
}

export default {
  getRemote,
}
