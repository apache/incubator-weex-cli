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
const fs = require('fs')

import * as PLATFORM from '../platform/platform'
import * as PROCESS from '../process/process'
import {
  ANDROID_SDK_NOT_FIND,
  ANDROID_ADB_NOT_FIND,
  ANDROID_EMULATOR_NOT_FIND,
  ANDROID_NDK_NOT_FIND,
} from '../error/error-list'

interface AndroidSdkOptions {
  sdkPath?: string
  adbPath?: string
}

const kAndroidHome = 'ANDROID_HOME'

class AndroidEnv {
  public ANDROID_SDK_PATH: string | null = null
  public ANDROID_ADB_PATH: string | null = null
  public ANDROID_EMULATOR_PATH: string | null = null
  private options: AndroidSdkOptions

  constructor(options: AndroidSdkOptions = {}) {
    this.options = options
  }

  public init() {
    const options = this.options
    this.ANDROID_SDK_PATH = options.sdkPath || this.getSdkPath()
    this.ANDROID_ADB_PATH = options.adbPath || this.getAdbPath()
    this.ANDROID_EMULATOR_PATH = this.getEmulatorPath()
  }

  public getSdkPath(isThrowError: boolean = true): string | null {
    let sdkPath
    if (process.env[kAndroidHome]) {
      sdkPath = process.env[kAndroidHome]
    } else {
      if (PLATFORM.isLinux) {
        sdkPath = path.join(PLATFORM.homedir, 'Android', 'Sdk')
      }
      if (PLATFORM.isMacOS) {
        sdkPath = path.join(PLATFORM.homedir, 'Library', 'Android', 'sdk')
      }
      if (PLATFORM.isWindows) {
        sdkPath = path.join(PLATFORM.homedir, 'AppData', 'Local', 'Android', 'sdk')
      }
    }

    if (fs.existsSync(path.join(sdkPath, 'platform-tools'))) {
      return sdkPath
    }

    if (isThrowError) {
      throw ANDROID_SDK_NOT_FIND
    }
    return null
  }

  public getAdbPath(isThrowError: boolean = true): string | null {
    this.ANDROID_SDK_PATH = this.ANDROID_SDK_PATH || this.getSdkPath()

    const defaultAdbPath = path.join(this.ANDROID_SDK_PATH, 'platform-tools', 'adb')
    if (this.ANDROID_SDK_PATH && (fs.existsSync(defaultAdbPath) || fs.existsSync(`${defaultAdbPath}.exe`))) {
      return defaultAdbPath
    }

    if (PLATFORM.isWindows) {
      const output = PROCESS.runAndGetOutput(`where adb`)

      if (output.indexOf('adb.exe') !== -1) {
        return path.join(output.replace('adb.exe', 'adb').replace(/\n/g, ''))
      }
    }

    if (PLATFORM.isLinux || PLATFORM.isMacOS) {
      const output = PROCESS.runAndGetOutput(`which adb`)

      if (output.indexOf('not found') === -1) {
        return path.join(output.replace(/\n/g, ''))
      }
    }

    if (isThrowError) {
      throw ANDROID_ADB_NOT_FIND
    }

    return null
  }

  public getEmulatorPath(sdkPath?: string, isThrowError: boolean = true): string {
    this.ANDROID_SDK_PATH = this.ANDROID_SDK_PATH || this.getSdkPath()
    const emulatorPath = path.join(
      this.ANDROID_SDK_PATH || sdkPath,
      'emulator',
      PLATFORM.isWindows ? 'emulator.exe' : 'emulator',
    )

    if (fs.existsSync(emulatorPath)) {
      return emulatorPath
    }

    if (isThrowError) {
      throw ANDROID_EMULATOR_NOT_FIND
    }
  }

  /**
   * Ndk is not necessary
   */
  public getNdkPath(sdkPath?: string, isThrowError: boolean = true): string {
    console.warn('Ndk is not necessary, please make sure you need it')
    this.ANDROID_SDK_PATH = this.ANDROID_SDK_PATH || this.getSdkPath()
    const ndkPath = path.join(this.ANDROID_SDK_PATH || sdkPath, 'ndk-bundle')

    if (fs.existsSync(ndkPath)) {
      return ndkPath
    }

    if (isThrowError) {
      throw ANDROID_NDK_NOT_FIND
    }
  }
}

export default AndroidEnv
