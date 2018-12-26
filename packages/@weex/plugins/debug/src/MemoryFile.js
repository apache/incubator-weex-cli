const URL = require('url')
const queryParser = require('querystring')
const _memoryFileMap = {}
const { util, crypto } = require('./util')

class MemoryFile {
  static get (name) {
    if (_memoryFileMap[name]) {
      return _memoryFileMap[name]
    }
    else {
      const keys = _memoryFileMap
      let content
      for (let key in keys) {
        if (key.indexOf(name) >= 0) {
          content = _memoryFileMap[key]
          break
        }
      }
      return content
    }
  }
  static dump () {
    return Object.keys(_memoryFileMap)
  }
  constructor (fileName, content) {
    const rHttpHeader = /^(https?|taobao|qap):\/\/(?!.*your_current_ip)/i
    if (rHttpHeader.test(fileName)) {
      const query = queryParser.parse(URL.parse(fileName).query)
      if (query['_wx_tpl']) {
        this.url = util.normalize(query['_wx_tpl'])
        this.name = this.url.replace(rHttpHeader, '')
      }
      else {
        this.url = util.normalize(fileName)
        this.name = this.url.replace(rHttpHeader, '')
      }
    }
    else {
      this.name = fileName.replace(
        /^(https?|taobao|qap):\/\/(.*your_current_ip):(\d+)\//i,
        'file://'
      )
    }
    if (this.name.charAt(this.name.length - 1) === '?') {
      this.name = this.name.substring(0, this.name.length - 1)
    }
    const md5Str = crypto.md5(content + fileName)
    const key = this.name.split('?')[0] + '|' + md5Str
    if (_memoryFileMap[this.name]) {
      _memoryFileMap[this.name].content = content
      return _memoryFileMap[this.name]
    }
    else if (_memoryFileMap[key]) {
      _memoryFileMap[key].content = content
      return _memoryFileMap[key]
    }
    else {
      this.content = content
    }
    this.md5 = md5Str
    _memoryFileMap[this.name] = this
    _memoryFileMap[key] = this
  }
  getContent () {
    return this.content
  }
  getUrl () {
    return '/source/' + this.name
  }
}
module.exports = MemoryFile
