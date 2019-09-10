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
import * as path from 'path'

export default class Config {
  public root: string = process.cwd()
  public rootPath: string = path.join(process.cwd(), './plugins')
  public filename: string = 'plugins.json'
  public androidPath: string = path.join(process.cwd(), './platforms/android')
  public iosPath: string = path.join(process.cwd(), './platforms/ios')
  public androidConfigFilename: string = '.weex_plugin.json'
  public defaultConfig: any = {
    ios: [],
    web: [],
    android: [],
  }

  constructor(options: any = {}) {
    this.root = options.root || this.root
    this.rootPath = options.rootPath || this.rootPath
    this.filename = options.filename || this.filename
    this.androidPath = options.androidPath || this.androidPath
    this.iosPath = options.iosPath || this.iosPath
    this.androidConfigFilename = options.androidConfigFilename || this.androidConfigFilename
    this.defaultConfig = options.defaultConfig || this.defaultConfig
  }
}
