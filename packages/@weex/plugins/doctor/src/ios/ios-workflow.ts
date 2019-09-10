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
import { Workflow, ValidationType, ValidationMessage, ValidationResult, DoctorValidator } from '../doctor'
import { Xcode, XcodeRequiredVersionMajor, XcodeRequiredVersionMinor } from '@weex-cli/utils/lib/ios/mac'
import {
  CocoaPods,
  CocoaPodsStatus,
  noCocoaPodsConsequence,
  cocoaPodsInstallInstructions,
  cocoaPodsUpgradeInstructions,
} from '@weex-cli/utils/lib/ios/cocoapods'
import { which } from '@weex-cli/utils/lib/process/process'
import { spawnSync } from 'child_process'
import { versionParse, compareVersion } from '@weex-cli/utils/lib/base/version'
import * as plist from '@weex-cli/utils/lib/ios/plist-utils'

// import IosEnv from '@weex-cli/utils/lib/ios/ios-env'

export class IOSWorkflow implements Workflow {
  get appliesToHostPlatform(): boolean {
    return process.platform === 'darwin'
  }

  public getPlistValueFromFile(path: string, key: string): string {
    return plist.getValueFromFile(path, key)
  }
}

export class IOSValidator implements DoctorValidator {
  public messages: ValidationMessage[] = []
  public xcodeStatus = ValidationType.missing
  public brewStatus = ValidationType.missing
  public xcodeVersionInfo: string
  public title: string
  public cocoaPods: CocoaPods = new CocoaPods()
  public xcode: Xcode = new Xcode()

  // private iosEnv: IosEnv = new IosEnv()
  constructor() {
    this.title = 'iOS toolchain - develop for iOS devices'
  }

  get hasHomebrew(): boolean {
    return !!which('brew').length
  }

  get hasIDeviceInstaller(): boolean {
    try {
      return spawnSync('ideviceinstaller', ['-h']).status === 0
    } catch (e) {
      return false
    }
  }

  get hasIosDeploy(): boolean {
    try {
      return spawnSync('ios-deploy', ['--version']).status === 0
    } catch (e) {
      return false
    }
  }

  get iosDeployVersionText(): string {
    try {
      return spawnSync('ios-deploy', ['--version'])
        .stdout.toString()
        .replace('\n', '')
    } catch (e) {
      return ''
    }
  }

  get iosDeployMinimumVersion() {
    return '1.9.2'
  }

  get iosDeployIsInstalledAndMeetsVersionCheck(): boolean {
    if (!this.hasIosDeploy) {
      return false
    }

    const version = versionParse(this.iosDeployVersionText)
    return compareVersion(version, versionParse(this.iosDeployMinimumVersion))
  }

  public validate() {
    if (this.xcode.isInstalled) {
      this.xcodeStatus = ValidationType.installed

      this.messages.push(new ValidationMessage(`Xcode at ${this.xcode.xcodeSelectPath}`))
      this.xcodeVersionInfo = this.xcode.versionText
      if (this.xcodeVersionInfo && this.xcodeVersionInfo.includes(',')) {
        this.xcodeVersionInfo = this.xcodeVersionInfo.substring(0, this.xcodeVersionInfo.indexOf(','))
        this.messages.push(new ValidationMessage(this.xcodeVersionInfo))
      }

      /**
       * installed and check xcode version
       */
      if (!this.xcode.isInstalledAndMeetsVersionCheck) {
        this.xcodeStatus = ValidationType.partial
        this.messages.push(
          new ValidationMessage(
            `Weex requires a minimum Xcode version of ${XcodeRequiredVersionMajor}.${XcodeRequiredVersionMinor}.0.\n
          Download the latest version or update via the Mac App Store.`,
            true /* isError */,
          ),
        )
      }

      /**
       * get admin
       */
      if (!this.xcode.eulaSigned) {
        this.xcodeStatus = ValidationType.partial
        this.messages.push(
          new ValidationMessage(
            "Xcode end user license agreement not signed; open Xcode or run the command 'sudo xcodebuild -license'.",
            true /* isError */,
          ),
        )
      }

      if (!this.xcode.isSimctlInstalled) {
        this.xcodeStatus = ValidationType.partial
        this.messages.push(
          new ValidationMessage(
            `Xcode requires additional components to be installed in order to run.\n'
          Launch Xcode and install additional required components when prompted.`,
            true /* isError */,
          ),
        )
      }
    } else {
      this.xcodeStatus = ValidationType.missing
      if (!this.xcode.xcodeSelectPath) {
        this.messages.push(
          new ValidationMessage(
            `Xcode not installed; this is necessary for iOS development.\n
          Download at https://developer.apple.com/xcode/download/.`,
            true /* isError */,
          ),
        )
      } else {
        this.messages.push(
          new ValidationMessage(
            `Xcode installation is incomplete; a full installation is necessary for iOS development.\n
          Download at: https://developer.apple.com/xcode/download/\n
          Or install Xcode via the App Store.\n
          Once installed, run:\n
            sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer`,
            true /* isError */,
          ),
        )
      }
    }

    // brew installed
    if (this.hasHomebrew) {
      this.brewStatus = ValidationType.installed

      // if (!iMobileDevice.isInstalled) {
      //   this.brewStatus = ValidationType.partial
      //   this.messages.push(
      //     new ValidationMessage(
      //       `libimobiledevice and ideviceinstaller are not installed. To install, run:\n
      //     brew install --HEAD libimobiledevice\n
      //     brew install ideviceinstaller`,
      //       true /* isError */,
      //     ),
      //   )
      // } else if (!iMobileDevice.isWorking) {
      //   this.brewStatus = ValidationType.partial
      //   this.messages.push(
      //     new ValidationMessage(
      //       `Verify that all connected devices have been paired with this computer in Xcode.\n
      //     If all devices have been paired, libimobiledevice and ideviceinstaller may require updating.\n
      //     To update, run:\n
      //     brew uninstall --ignore-dependencies libimobiledevice\n
      //     brew install --HEAD libimobiledevice\n
      //     brew install ideviceinstaller`,
      //       true /* isError */,
      //     ),
      //   )
      // } else if (!this.hasIDeviceInstaller) {
      //   this.brewStatus = ValidationType.partial
      //   this.messages.push(
      //     new ValidationMessage(
      //       `ideviceinstaller is not installed; this is used to discover connected iOS devices.\n
      //     To install, run:\n
      //     brew install --HEAD libimobiledevice\n
      //     brew install ideviceinstaller`,
      //       true /* isError */,
      //     ),
      //   )
      // }

      // if (this.hasIosDeploy) {
      //   this.messages.push(new ValidationMessage(`ios-deploy ${this.iosDeployVersionText}`))
      // }

      // if (!this.iosDeployIsInstalledAndMeetsVersionCheck) {
      //   this.brewStatus = ValidationType.partial
      //   if (this.hasIosDeploy) {
      //     this.messages.push(
      //       new ValidationMessage(
      //         `ios-deploy out of date (${this.iosDeployMinimumVersion} is required). To upgrade:\n
      //       brew upgrade ios-deploy`,
      //         true /* isError */,
      //       ),
      //     );
      //   } else {
      //     this.messages.push(
      //       new ValidationMessage(
      //         `ios-deploy not installed. To install:\n
      //       brew install ios-deploy`,
      //         true /* isError */,
      //       ),
      //     )
      //   }

      // }

      const cocoaPodsStatus = this.cocoaPods.evaluateCocoaPodsInstallation

      if (cocoaPodsStatus === CocoaPodsStatus.recommended) {
        if (this.cocoaPods.isCocoaPodsInitialized) {
          this.messages.push(new ValidationMessage(`CocoaPods version ${this.cocoaPods.cocoaPodsVersionText}`))
        } else {
          this.brewStatus = ValidationType.partial
          this.messages.push(
            new ValidationMessage(
              `CocoaPods installed but not initialized.\n
            ${noCocoaPodsConsequence}\n
            To initialize CocoaPods, run:\n
              pod setup\n
            once to finalize CocoaPods\' installation.`,
              true /* isError */,
            ),
          )
        }
      } else {
        this.brewStatus = ValidationType.partial
        if (cocoaPodsStatus === CocoaPodsStatus.notInstalled) {
          this.messages.push(
            new ValidationMessage(
              `CocoaPods not installed.\n
    ${noCocoaPodsConsequence}\n
    To install:
    ${cocoaPodsInstallInstructions}`,
              true /* isError */,
            ),
          )
        } else {
          this.messages.push(
            new ValidationMessage(
              `CocoaPods out of date (${this.cocoaPods.cocoaPodsRecommendedVersion} is recommended).\n
            ${noCocoaPodsConsequence}\n
            To upgrade:\n
            ${cocoaPodsUpgradeInstructions}`,
              true /* isError */,
            ),
          )
        }
      }
    } else {
      this.brewStatus = ValidationType.missing
      this.messages.push(
        new ValidationMessage(
          `Brew not installed; use this to install tools for iOS device development.\n
        Download brew at https://brew.sh/.`,
          true /* isError */,
        ),
      )
    }
    return new ValidationResult(
      [this.xcodeStatus, this.brewStatus].reduce(this.mergeValidationTypes),
      this.messages,
      this.xcodeVersionInfo,
    )
  }

  private mergeValidationTypes(t1: ValidationType, t2: ValidationType): ValidationType {
    return t1 === t2 ? t1 : ValidationType.partial
  }
}
