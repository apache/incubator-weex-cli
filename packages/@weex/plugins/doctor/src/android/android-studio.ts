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
import { isMacOS, isLinux, homedir } from '@weex-cli/utils/lib/platform/platform'
import * as path from 'path'
import * as fs from 'fs'
import { IOSWorkflow } from '../ios/ios-workflow'
import { kCFBundleShortVersionStringKey } from '@weex-cli/utils/lib/ios/plist-utils'
import { versionParse, VersionOption, compareVersion } from '@weex-cli/utils/lib/base/version'
import { canRunSync, runSync } from '../base/process'

import * as debug from 'debug'
const DEBUG = debug('plugin:doctor:android-studio')

// Android Studio layout:

// Linux/Windows:
// $HOME/.AndroidStudioX.Y/system/.home

// macOS:
// /Applications/Android Studio.app/Contents/
// $HOME/Applications/Android Studio.app/Contents/

const _dotHomeStudioVersionMatcher = new RegExp('^.AndroidStudio([^d]*)([d.]+)')

interface ValidOption {
  configured?: string
  version?: VersionOption
}

export class AndroidStudioValid {
  public isValid: boolean = true
  public validationMessages: string[] = []
  public configured: string
  public javaPath: string
  public version: VersionOption

  constructor(public directory: string, public option?: ValidOption) {
    this.directory = directory
    this.configured = this.option.configured
    this.version = this.option.version
    this.init()
  }

  public init() {
    if (this.configured) {
      this.validationMessages.push(`android-studio-dir = ${this.configured}`)
    }

    if (!fs.existsSync(this.directory)) {
      this.validationMessages.push(`Android Studio not found at ${this.directory}`)
      return
    }

    let javaPath = isMacOS
      ? path.join(this.directory, 'jre', 'jdk', 'Contents', 'Home')
      : path.join(this.directory, 'jre')
    const javaExecutable = path.join(javaPath, 'bin', 'java')
    if (!canRunSync(javaExecutable, ['-version'])) {
      this.validationMessages.push(`Unable to find bundled Java version.`)
    } else {
      const result = runSync(javaExecutable, ['-version'])
      if (result && result.status === 0) {
        const versionLines = result.stderr.toString().split('\n')
        const javaVersion = versionLines.length >= 2 ? versionLines[1] : versionLines[0]
        this.validationMessages.push(`Java version ${javaVersion}`)
        this.isValid = true
        this.javaPath = javaPath
      } else {
        this.validationMessages.push('Unable to determine bundled Java version.')
      }
    }
  }
}

export class AndroidStudio {
  public javaPath: string
  public iosWorkflow = new IOSWorkflow()

  constructor() {
    this.latestValid()
  }

  // Locates the newest, valid version of Android Studio.
  public latestValid() {
    const studios = this.allInstalled()
    if (studios.length) {
      this.javaPath = studios[studios.length - 1].javaPath
    }
    // for (let i = 0; i < studios.length; i++) {

    // }
  }

  public allInstalled(): AndroidStudioValid[] {
    return isMacOS ? this.allMacOS() : this.allLinuxOrWindows()
  }

  public allMacOS(): AndroidStudioValid[] {
    let directories = []
    this.checkForStudio('/Applications').forEach(name => {
      directories.push(`/Applications/${name}`)
    })
    this.checkForStudio(path.join(homedir, 'Applications')).forEach(name => {
      directories.push(path.join(homedir, 'Applications', name))
    })
    return directories.map(path => this.fromMacOSBundle(path))
  }

  public checkForStudio(path: string): string[] {
    if (!fs.existsSync(path)) {
      return []
    }
    const candidatePaths = []

    try {
      const directories = fs.readdirSync(path)
      for (let name of directories) {
        // An exact match, or something like 'Android Studio 3.0 Preview.app'.
        if (name.startsWith('Android Studio') && name.endsWith('.app')) {
          candidatePaths.push(name)
        }
      }
    } catch (e) {
      console.error(e)
    }
    return candidatePaths
  }

  public fromMacOSBundle(bundlePath: string): AndroidStudioValid {
    const studioPath = path.join(bundlePath, 'Contents')
    const plistFile: any = path.join(studioPath, 'Info.plist')
    const versionString = this.iosWorkflow.getPlistValueFromFile(plistFile, kCFBundleShortVersionStringKey)
    let version: VersionOption
    if (versionString) {
      version = versionParse(versionString)
    }
    return new AndroidStudioValid(studioPath, { version: version })
  }

  public fromHomeDot(homeDotDir) {
    const versionMatch = path.basename(homeDotDir).match(_dotHomeStudioVersionMatcher)[1]
    if (versionMatch.length !== 3) {
      return null
    }
    const version: VersionOption = versionParse(versionMatch[2])
    if (!version) {
      return null
    }
    let installPath
    if (fs.existsSync(path.join(homeDotDir, 'system', '.home'))) {
      installPath = path.join(homeDotDir, 'system', '.home')
    }
    if (installPath) {
      return new AndroidStudioValid(installPath, { version: version })
    }
    return null
  }

  public allLinuxOrWindows() {
    let studios: AndroidStudioValid[] = []

    function hasStudioAt(path: string, newerThan?: VersionOption): boolean {
      return studios.every(studio => {
        if (studio.directory !== path) {
          return false
        }
        if (newerThan) {
          return compareVersion(studio.version, newerThan)
        }
        return true
      })
    }

    // Read all $HOME/.AndroidStudio*/system/.home files. There may be several
    // pointing to the same installation, so we grab only the latest one.
    if (fs.existsSync(homedir)) {
      for (let entity of fs.readdirSync(homedir)) {
        const homeDotDir: any = path.join(homedir, entity)
        try {
          let homeDotDirType = fs.statSync(homeDotDir)
          if (homeDotDirType && homeDotDirType.isDirectory() && entity.startsWith('.AndroidStudio')) {
            const studio = this.fromHomeDot(homeDotDir)
            if (studio && !hasStudioAt(studio.directory, studio.version)) {
              studios = studios.filter(other => other.directory !== studio.directory)
              studios.push(studio)
            }
          }
        } catch (error) {
          DEBUG(error, homeDotDir)
        }
      }
    }

    function checkWellKnownPath(path: string) {
      if (fs.existsSync(path) && !hasStudioAt(path)) {
        studios.push(new AndroidStudioValid(path))
      }
    }

    if (isLinux) {
      // Add /opt/android-studio and $HOME/android-studio, if they exist.
      checkWellKnownPath('/opt/android-studio')
      checkWellKnownPath(`${homedir}/android-studio`)
    }

    return studios
  }
}
