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
import { runSync } from '../process/process'
import * as path from 'path'
import * as fs from 'fs'
import { versionParse, VersionOption, compareVersion } from '../base/version'
import { homedir } from '../platform/platform'

export const noCocoaPodsConsequence: string = `CocoaPods is used to retrieve the iOS platform side's plugin code.\nWithout resolving iOS dependencies with CocoaPods, plugins will not work on iOS.`

export const cocoaPodsInstallInstructions: string = `
  brew install cocoapods
  pod setup`

export const cocoaPodsUpgradeInstructions: string = `
  brew upgrade cocoapods
  pod setup`

export enum CocoaPodsStatus {
  // iOS plugins will not work, installation required.
  notInstalled,
  // iOS plugins will not work, upgrade required.
  belowMinimumVersion,
  // iOS plugins may not work in certain situations (Swift, static libraries),
  // upgrade recommended.
  belowRecommendedVersion,
  // Everything should be fine.
  recommended,
}

export class CocoaPods {
  public cocoaPodsMinimumVersion: string = '1.0.0'
  public cocoaPodsRecommendedVersion: string = '1.5.0'
  public cocoaPodsVersionText: string

  constructor() {
    const result = runSync('pod', ['--version'])
    if (result && result.status === 0) {
      this.cocoaPodsVersionText = result.stdout.toString().trim()
    }
  }

  get evaluateCocoaPodsInstallation() {
    if (!this.cocoaPodsVersionText) {
      return CocoaPodsStatus.notInstalled
    }
    try {
      const version: VersionOption = versionParse(this.cocoaPodsVersionText)
      if (!compareVersion(version, versionParse(this.cocoaPodsMinimumVersion))) {
        return CocoaPodsStatus.belowMinimumVersion
      } else if (!compareVersion(version, versionParse(this.cocoaPodsRecommendedVersion))) {
        return CocoaPodsStatus.belowRecommendedVersion
      } else {
        return CocoaPodsStatus.recommended
      }
    } catch (e) {
      return CocoaPodsStatus.notInstalled
    }
  }

  // where the costly pods' specs are cloned.
  get isCocoaPodsInitialized(): boolean {
    const cocoaPath = path.join(homedir, '.cocoapods', 'repos', 'master')
    if (fs.existsSync(cocoaPath)) {
      return fs.statSync(cocoaPath).isDirectory()
    }
    return false
  }
}
