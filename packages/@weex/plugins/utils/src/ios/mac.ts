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
import { spawnSync } from 'child_process'
import { XcodeProjectInterpreter } from './xcodeproj'

export const XcodeRequiredVersionMajor = 9
export const XcodeRequiredVersionMinor = 0

export function xcodeSelectPath(): string {
  try {
    return spawnSync('/usr/bin/xcode-select', ['--print-path']).stdout.trim()
  } catch (e) {
    return ''
  }
}

export function isXcodeInstalled() {
  return !!xcodeSelectPath()
}

export class Xcode {
  public xcodeSelectPath: string
  public XcodeProjectInterpreter: XcodeProjectInterpreter = new XcodeProjectInterpreter()

  constructor() {
    this.getXcodeSelectPath()
  }

  public getXcodeSelectPath() {
    try {
      this.xcodeSelectPath = spawnSync('/usr/bin/xcode-select', ['--print-path'])
        .stdout.toString()
        .trim()
    } catch (e) {
      throw e
    }
  }

  get isInstalled() {
    if (!this.xcodeSelectPath) {
      return false
    }
    return true
  }

  get versionText() {
    return this.XcodeProjectInterpreter.versionText
  }

  get majorVersion() {
    return this.XcodeProjectInterpreter.majorVersion
  }

  get minorVersion() {
    return this.XcodeProjectInterpreter.minorVersion
  }

  get isVersionSatisfactory(): boolean {
    if (!this.XcodeProjectInterpreter.isInstalled) {
      return false
    } else if (this.majorVersion > XcodeRequiredVersionMajor) {
      return true
    } else if (this.majorVersion === XcodeRequiredVersionMajor) {
      return this.minorVersion >= XcodeRequiredVersionMinor
    }
    return false
  }

  get isInstalledAndMeetsVersionCheck(): boolean {
    return this.isInstalled && this.isVersionSatisfactory
  }

  // Has the EULA been signed?
  get eulaSigned(): boolean {
    try {
      const result = spawnSync('/usr/bin/xcrun', ['clang', '-v'])
      if (result.stdout && result.stdout.includes('license')) {
        return false
      } else if (result.stderr && result.stderr.includes('license')) {
        return false
      } else {
        return true
      }
    } catch (e) {
      console.error(e)
      return false
    }
  }

  /**
   * if additional components need to be installed in
   */
  get isSimctlInstalled(): boolean {
    try {
      const result = spawnSync('/usr/bin/xcrun', ['simctl', 'list'])
      return !result.stderr.toString().trim() || result.stderr.toString().trim() === ''
    } catch (e) {
      console.error(e)
      return false
    }
  }
}

export class IMobileDevice {
  get isInstalled(): boolean {
    try {
      const result = spawnSync('idevice_id', ['-h'])
      if (result.status === 0) {
        return true
      }
    } catch (e) {
      return false
    }
    return false
  }

  get isWorking(): boolean {
    if (!this.isInstalled) {
      return false
    }

    try {
      const result = spawnSync('idevice_id', ['-l'])
      if (result.status === 0 || !result.stdout.toString().length) {
        return true
      }
    } catch (e) {
      return false
    }
    try {
      return spawnSync('idevicename').status === 0
    } catch (e) {
      return false
    }
  }
}
