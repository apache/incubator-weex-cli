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
const fs = require('fs')
const path = require('path')

/**
 * Help get test config and show warning
 * `test.config.json` is in project root path
 */

export default class TestHelp {
  private projectPath: string
  private config: any = null

  constructor(projectPath) {
    this.projectPath = projectPath
    this.getTestConfig()
  }

  public getTestConfig() {
    const configPath = path.join(this.projectPath, 'test.config.json')

    if (!fs.existsSync(configPath)) {
      console.warn('Please create `test.config.json` in project root path')
      console.warn('Please try copy `./test/test.config.template.json` to `./test.config.json`, and edit it')
      return null
    }

    try {
      this.config = JSON.parse(fs.readFileSync(configPath).toString() || '{}')
      return this.config
    } catch (e) {
      console.error('Get test config fail: ', e)
      return null
    }
  }

  public getTestConfigByKey(key: string, keyExplain?: string) {
    const config = this.config

    if (config === null) {
      return null
    }

    const value = config[key]

    if (value === undefined) {
      console.warn(`Please set the key : ${key} in 'test.config.json'`)
      console.warn(`The key: ${key} , ${keyExplain}`)
      return null
    }

    return config[key]
  }
}
