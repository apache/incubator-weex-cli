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
import { isMacOS } from '../platform/platform'
import { existsSync } from 'fs'
import { spawnSync } from 'child_process'

// Interpreter of Xcode projects.
export class XcodeProjectInterpreter {
  private executable: string = '/usr/bin/xcodebuild'
  public versionText: string
  public versionRegex = /Xcode ([0-9.]+)/
  public majorVersion: number
  public minorVersion: number

  constructor() {
    this.updateVersion()
  }

  public updateVersion() {
    if (!isMacOS || !existsSync(this.executable)) {
      return
    }
    try {
      const result = spawnSync(this.executable, ['-version'])
      this.versionText = result.stdout
        .toString()
        .trim()
        .replace('\n', ', ')
      const match = this.versionText.match(this.versionRegex)
      if (match === null) {
        return
      }
      const version = match[1]
      const components = version.split('.')
      this.majorVersion = Number(components[0])
      this.minorVersion = components.length === 1 ? 0 : Number(components[1])
    } catch (e) {
      console.error(e)
    }
  }

  get isInstalled() {
    if (this.majorVersion === undefined) {
      this.updateVersion()
    }
    return this.majorVersion !== undefined
  }
}

// export const xcodeProjectInterpreter = new XcodeProjectInterpreter()
