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
// Android SDK layout:

// $ANDROID_HOME/platform-tools/adb

// $ANDROID_HOME/build-tools/19.1.0/aapt, dx, zipalign
// $ANDROID_HOME/build-tools/22.0.1/aapt
// $ANDROID_HOME/build-tools/23.0.2/aapt
// $ANDROID_HOME/build-tools/24.0.0-preview/aapt
// $ANDROID_HOME/build-tools/25.0.2/apksigner

// $ANDROID_HOME/platforms/android-22/android.jar
// $ANDROID_HOME/platforms/android-23/android.jar
// $ANDROID_HOME/platforms/android-N/android.jar

import * as path from 'path'
import * as fs from 'fs'
import { isLinux, isMacOS, isWindows, homedir } from '@weex-cli/utils/lib/platform/platform'
import { which, canRunSync } from '../base/process'
import { versionParse, VersionOption } from '@weex-cli/utils/lib/base/version'
import { AndroidStudio } from './android-studio'

export const kAndroidHome: String = 'ANDROID_HOME'
const numberedAndroidPlatformRe: RegExp = new RegExp('^android-([0-9P]+)$')
// const sdkVersionRe: RegExp = new RegExp('^ro.build.version.sdk=([0-9]+)$')
const javaHomeEnvironmentVariable: String = 'JAVA_HOME'
// const javaExecutable: String = 'java'

// The minimum Android SDK version we support.
// const minimumAndroidSdkVersion: number = 26
export const mustAndroidSdkVersion: number = 26

export class AndroidSdkVersion {
  constructor(
    public sdk: AndroidSdk,
    public sdkLevel: number,
    public platformName: string,
    public buildToolsVersion: VersionOption,
  ) {
    this.sdk = sdk
    this.sdkLevel = sdkLevel
    this.platformName = platformName
    this.buildToolsVersion = buildToolsVersion
  }

  get buildToolsVersionName(): string {
    if (!this.buildToolsVersion) {
      return ''
    }
    return `${this.buildToolsVersion.major}.${this.buildToolsVersion.minor}.${this.buildToolsVersion.patch}`
  }

  get androidJarPath() {
    return this.getPlatformsPath('android.jar')
  }

  get aaptPath() {
    return this.getBuildToolsPath('aapt')
  }

  public getPlatformsPath(itemName: string) {
    return path.join(this.sdk.directory, 'platforms', this.platformName, itemName)
  }

  public getBuildToolsPath(binaryName: string) {
    if (!this.buildToolsVersionName) {
      return ''
    }
    return path.join(this.sdk.directory, 'build-tools', this.buildToolsVersionName, binaryName)
  }

  public validateSdkWellFormed(): string[] {
    if (this.exists(this.androidJarPath) !== null) {
      return [this.exists(this.androidJarPath)]
    }
    if (this.canRun(this.aaptPath, ['v']) !== null) {
      return [this.canRun(this.aaptPath, ['v'])]
    }

    return []
  }

  public exists(path: string) {
    if (!fs.existsSync(path)) {
      return `Android SDK file not found: ${path}.`
    }
    return null
  }

  public canRun(path: string, args: string[] = []) {
    if (!canRunSync(path, args)) {
      return `Android SDK file not found: ${path}.`
    }
    return null
  }
}

export class AndroidSdk {
  public directory: string
  public sdkVersions: AndroidSdkVersion[] = []
  public latestVersion: AndroidSdkVersion
  public androidStudio: AndroidStudio = new AndroidStudio()
  public isMustAndroidSdkVersion: boolean = false

  constructor() {
    this.init()
  }

  get adbPath() {
    return this.getPlatformToolsPath('adb')
  }

  get sdkManagerPath() {
    return path.join(this.directory, 'tools', 'bin', 'sdkmanager')
  }

  public findJavaBinary() {
    if (this.androidStudio.javaPath) {
      return path.join(this.androidStudio.javaPath, 'bin', 'java')
    }
    const javaHomeEnv = process.env[`${javaHomeEnvironmentVariable}`]
    if (javaHomeEnv) {
      // Trust JAVA_HOME.
      return path.join(javaHomeEnv, 'bin', 'java')
    }
  }

  public getPlatformToolsPath(binaryName: string) {
    return path.join(this.directory, 'platform-tools', binaryName)
  }

  public validateSdkWellFormed(): string[] {
    if (!canRunSync(this.adbPath, ['version'])) {
      return [`Android SDK file not found: ${this.adbPath}.`]
    }
    if (!this.sdkVersions.length || !this.latestVersion) {
      return [`Android SDK is missing command line tools; download from https://goo.gl/XxQghQ`]
    }

    return this.latestVersion.validateSdkWellFormed()
  }

  public locateAndroidSdk() {
    this.directory = this.findAndroidHomeDir()
  }

  public findAndroidHomeDir() {
    let androidHomeDir: string
    if (process.env[`${kAndroidHome}`]) {
      androidHomeDir = process.env[`${kAndroidHome}`]
    } else if (homedir) {
      if (isLinux) {
        androidHomeDir = path.join(homedir, 'Android', 'Sdk')
      } else if (isMacOS) {
        androidHomeDir = path.join(homedir, 'Library', 'Android', 'sdk')
      } else if (isWindows) {
        androidHomeDir = path.join(homedir, 'AppData', 'Local', 'Android', 'sdk')
      }
    }

    if (androidHomeDir) {
      if (this.validSdkDirectory(androidHomeDir)) {
        return androidHomeDir
      }
      if (this.validSdkDirectory(path.join(androidHomeDir, 'sdk'))) {
        return path.join(androidHomeDir, 'sdk')
      }
    }

    const aaptBins = which('aapt')

    for (let aaptBin in aaptBins) {
      const dir = path.resolve(aaptBin, '../../')
      if (this.validSdkDirectory(dir)) {
        return dir
      }
    }

    const adbBins = which('adb')
    for (let adbBin in adbBins) {
      const dir = path.resolve(adbBin, '../../')
      if (this.validSdkDirectory(dir)) {
        return dir
      }
    }
    return null
  }

  public validSdkDirectory(dir) {
    const dirPath = path.join(dir, 'platform-tools')
    if (fs.existsSync(dirPath)) {
      return fs.statSync(dirPath).isDirectory()
    }
    return false
  }

  public init() {
    this.locateAndroidSdk()
    if (!this.directory) {
      return
    }
    let platforms: string[] = [] // android-23 android-25 android-26 android-27...
    const platformsDir: string = path.join(this.directory, 'platforms')

    let buildTools: string[] = [] // 23.0.1 25.0.3 26.0.0 26.0.2 27.0.3...
    const buildToolsDir: string = path.join(this.directory, 'build-tools')

    if (fs.existsSync(platformsDir)) {
      platforms = fs.readdirSync(platformsDir)
    }

    if (fs.existsSync(buildToolsDir)) {
      buildTools = fs.readdirSync(buildToolsDir)
    }

    platforms.map(platformName => {
      let matchVersion: any = platformName.match(numberedAndroidPlatformRe)
      if (Array.isArray(matchVersion) && matchVersion.length > 1) {
        matchVersion = matchVersion[1]
      } else {
        return null
      }
      if (matchVersion === 'P') {
        matchVersion = '28'
      }
      const platformVersion = Number(matchVersion)
      if (mustAndroidSdkVersion === platformVersion) {
        this.isMustAndroidSdkVersion = true
      }
      let buildToolsVersion
      buildTools.forEach(version => {
        const versionOption = versionParse(version)
        if (versionOption && versionOption.major === platformVersion) {
          buildToolsVersion = versionParse(version)
        }
      })

      if (!buildTools) {
        return null
      }
      this.sdkVersions.push(new AndroidSdkVersion(this, platformVersion, platformName, buildToolsVersion))
    })
    if (this.sdkVersions.length) {
      this.latestVersion = this.sdkVersions[this.sdkVersions.length - 1]
    }
  }
}
