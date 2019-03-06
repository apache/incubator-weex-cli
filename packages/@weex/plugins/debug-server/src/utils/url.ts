import * as url from 'url'
import * as querystring from 'querystring'

export const normalize = remoteurl => {
  const urlObj: any = url.parse(remoteurl)
  if (urlObj.query) {
    urlObj.query = querystring.stringify(querystring.parse(urlObj.query))
    urlObj.search = '?' + urlObj.query
  }
  return urlObj.format()
}

export const parseQuery = fileName => {
  return querystring.parse(url.parse(fileName).query)
}

export default {
  parseQuery,
  normalize,
}
