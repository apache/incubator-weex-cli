const MENMORY_FILE_MAP = {}

import utils from './utils'
export default class MemoryFile {
  static get(name: string) {
    if (MENMORY_FILE_MAP[name]) {
      return MENMORY_FILE_MAP[name]
    } else {
      const keys = MENMORY_FILE_MAP
      let content
      for (let key in keys) {
        if (key.indexOf(name) >= 0) {
          content = MENMORY_FILE_MAP[key]
          break
        }
      }
      return content
    }
  }
  static dump() {
    return Object.keys(MENMORY_FILE_MAP)
  }
  private url: string
  private name: string
  private content: string
  md5: string
  constructor(fileName, content) {
    const rHttpHeader = /^(https?|taobao|qap):\/\/(?!.*your_current_ip)/i
    if (rHttpHeader.test(fileName)) {
      this.url = utils.url.normalize(fileName)
      this.name = this.url.replace(rHttpHeader, '')
    } else {
      this.name = fileName.replace(/^(https?|taobao|qap):\/\/(.*your_current_ip):(\d+)\//i, 'file://')
    }
    if (this.name.charAt(this.name.length - 1) === '?') {
      this.name = this.name.substring(0, this.name.length - 1)
    }
    const md5Str = utils.crypto.md5(content + fileName)
    const key = this.name.split('?')[0] + '|' + md5Str
    if (MENMORY_FILE_MAP[this.name]) {
      MENMORY_FILE_MAP[this.name].content = content
      return MENMORY_FILE_MAP[this.name]
    } else if (MENMORY_FILE_MAP[key]) {
      MENMORY_FILE_MAP[key].content = content
      return MENMORY_FILE_MAP[key]
    } else {
      this.content = content
    }
    this.md5 = md5Str
    MENMORY_FILE_MAP[this.name] = this
    MENMORY_FILE_MAP[key] = this
  }

  getContent() {
    return this.content
  }

  getUrl() {
    return '/source/' + this.name
  }
}
