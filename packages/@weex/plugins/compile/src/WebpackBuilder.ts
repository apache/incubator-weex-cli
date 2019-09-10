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
const path = require('path')
const sourcer = require('sourcer')

export default class WebpackBuilder {
  public source: string[]
  public rawSource: string
  public options: {
    [key: string]: any
  }
  public base: string
  public dest: string

  constructor(source: string, dest: string, options: any) {
    const root = options.root || process.cwd()
    const ext = path.extname(source)
    const defaultExt = ['vue']
    if (!(options.ext && typeof options.ext === 'string')) {
      options.ext = defaultExt.join('|')
    }
    this.rawSource = source
    if (ext) {
      this.source = [path.resolve(source)]
      this.base = options.base || path.resolve(source.replace(path.basename(source), ''))
    } else {
      this.source = sourcer.find(root, source, {
        recursive: true,
      })
      this.base = path.resolve(sourcer.base(source))
      if (options.ext) {
        const reg = new RegExp('\\.(' + options.ext + ')$')
        this.source = this.source.filter(s => reg.test(path.extname(s)))
      }
    }
    this.dest = path.resolve(dest)
    this.options = options
  }
}
