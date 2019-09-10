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
import { kAndroidHome, AndroidSdk, mustAndroidSdkVersion } from './android-sdk'
import { canRunSync, runSync } from '../base/process'

// const licenseAccepted = new RegExp('All SDK package licenses accepted.')
const jdkDownload: String = 'https://www.oracle.com/technetwork/java/javase/downloads/'

// enum LicensesAccepted {
//   none,
//   some,
//   all,
//   unknown,
// }

export class AndroidWorkflow implements Workflow {
  get appliesToHostPlatform(): boolean {
    return true
  }
}

export class AndroidValidator implements DoctorValidator {
  public title: string
  public messages: ValidationMessage[] = []
  public androidSdk: AndroidSdk = new AndroidSdk()
  constructor() {
    this.title = 'Android toolchain - develop for Android devices'
  }

  public validate() {
    // android-sdk
    if (!this.androidSdk.directory) {
      // No Android SDK found.
      if (process.env[`${kAndroidHome}`]) {
        const androidHomeDir: string = process.env[`${kAndroidHome}`]
        this.messages.push(
          new ValidationMessage(
            `${kAndroidHome} = ${androidHomeDir}
            but Android SDK not found at this location.`,
            true /* isError */,
          ),
        )
      } else {
        this.messages.push(
          new ValidationMessage(
            `Unable to locate Android SDK.
            Install Android Studio from: https://developer.android.com/studio/index.html
            On first launch it will assist you in installing the Android SDK components.
            If Android SDK has been installed to a custom location, set ${kAndroidHome} to that location.`,
            true /* isError */,
          ),
        )
      }
      return new ValidationResult(ValidationType.missing, this.messages)
    }
    if (!this.androidSdk.isMustAndroidSdkVersion) {
      this.messages.push(
        new ValidationMessage(
          `There is no required version SDK plaform android-${mustAndroidSdkVersion}.`,
          false /* isError */,
          true /* isWaring */,
        ),
      )
    }

    this.messages.push(new ValidationMessage(`Android SDK at ${this.androidSdk.directory}`))

    let sdkVersionText: string
    if (this.androidSdk.latestVersion) {
      sdkVersionText = `Android SDK ${this.androidSdk.latestVersion.buildToolsVersionName}`
      this.messages.push(
        new ValidationMessage(
          `Platform ${this.androidSdk.latestVersion.platformName}, build-tools ${
            this.androidSdk.latestVersion.buildToolsVersionName
          }`,
        ),
      )
    }

    if (process.env[`${kAndroidHome}`]) {
      const androidHomeDir: string = process.env[`${kAndroidHome}`]
      this.messages.push(new ValidationMessage(`${kAndroidHome} = ${androidHomeDir}\n`))
    }

    const validationResult = this.androidSdk.validateSdkWellFormed()

    if (validationResult.length) {
      // Android SDK is not functional.
      // validationResult.forEach(message => {
      //   this.messages.push(new ValidationMessage(message, true /* isError */))
      // })
      this.messages.push(new ValidationMessage(`Try re-installing or updating your Android SDK.`))
      return new ValidationResult(ValidationType.partial, this.messages, sdkVersionText)
    }

    // Now check for the JDK.
    const javaBinary = this.androidSdk.findJavaBinary()
    if (!javaBinary) {
      this.messages.push(
        new ValidationMessage(
          `No Java Development Kit (JDK) found; You must have the environment
          variable JAVA_HOME set and the java binary in your PATH. 
          You can download the JDK from ${jdkDownload}.`,
          true /* isError */,
        ),
      )
    }

    // Check JDK version.
    if (!this.checkJavaVersion(javaBinary)) {
      return new ValidationResult(ValidationType.partial, this.messages, sdkVersionText)
    }

    // Check for licenses.

    // Success.
    return new ValidationResult(ValidationType.installed, this.messages, sdkVersionText)
  }

  public checkJavaVersion(javaBinary) {
    if (!canRunSync(javaBinary, ['-version'])) {
      this.messages.push(
        new ValidationMessage(`Cannot execute ${javaBinary} to determine the version.`, true /* isError */),
      )
      return false
    }
    let javaVersion: string
    const result = runSync(javaBinary, ['-version'])
    if (result.status === 0) {
      const versionLines = result.stderr.toString().split('\n')
      javaVersion = versionLines.length >= 2 ? versionLines[1] : versionLines[0]
    }
    if (!javaVersion) {
      this.messages.push(new ValidationMessage(`Could not determine java version.`, true /* isError */))
      return false
    }
    this.messages.push(new ValidationMessage(`Java version ${javaVersion}.`))
    return true
  }

  public licensesAccepted() {
    // let status: LicensesAccepted
  }
}
