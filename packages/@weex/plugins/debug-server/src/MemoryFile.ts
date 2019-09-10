/* Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
