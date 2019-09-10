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
import { AndroidWorkflow, AndroidValidator } from './android/android-workflow'
import { IOSWorkflow, IOSValidator } from './ios/ios-workflow'
import { isWindows } from '@weex-cli/utils/lib/platform/platform'
import * as colors from 'colors'

export const enum ValidationType {
  missing,
  partial,
  installed,
}

class ValidatorTask {
  constructor(public validator: DoctorValidator, public result: ValidationResult) {
    this.validator = validator
    this.result = result
  }
}

export class ValidationResult {
  /// [ValidationResult.type] should only equal [ValidationResult.installed]
  /// if no [messages] are hints or errors.
  constructor(public type: ValidationType, public messages: ValidationMessage[], public statusInfo?: string) {
    this.type = type
    this.messages = messages
  }

  get leadingBox(): String {
    switch (this.type) {
      case ValidationType.missing:
        return '[✗]'
      case ValidationType.installed:
        return '[✓]'
      case ValidationType.partial:
        return '[!]'
    }
    return null
  }
}

export class Doctor {
  public validators: DoctorValidator[] = []
  public iosWorkflow = new IOSWorkflow()
  public androidWorkflow = new AndroidWorkflow()

  constructor() {
    this.getValidators()
  }

  public getValidators() {
    if (this.androidWorkflow.appliesToHostPlatform) {
      this.validators.push(new AndroidValidator())
    }
    if (!isWindows && this.iosWorkflow.appliesToHostPlatform) {
      this.validators.push(new IOSValidator())
    }
  }

  public startValidatorTasks() {
    const tasks = []
    for (let validator of this.validators) {
      tasks.push(new ValidatorTask(validator, validator.validate()))
    }
    return tasks
  }

  /**
   * diagnose
   */
  public diagnose(): string {
    const taskList: ValidatorTask[] = this.startValidatorTasks()
    let messageResult: string = ''

    for (let validatorTask of taskList) {
      const validator: DoctorValidator = validatorTask.validator
      const results: ValidationResult[] = []
      let result: ValidationResult
      let color: any
      results.push(validatorTask.result)
      result = this.mergeValidationResults(results)
      color =
        result.type === ValidationType.missing
          ? colors.red
          : result.type === ValidationType.installed
          ? colors.green
          : colors.yellow
      // console.log(this.androidSdk.latestVersion.AndroidSdkVersion.sdkLevel)
      messageResult += `${color(`\n${result.leadingBox} ${validator.title}\n`)}`
      // console.log(`${result.leadingBox} ${validator.title} is`)
      for (let message of result.messages) {
        const text = message.message.replace('\n', '\n      ')
        if (message.isError) {
          messageResult += `${colors.red(`    ✗  ${text}`)}\n`
          // console.log(`    ✗  ${text}`);
        } else if (message.isWaring) {
          messageResult += `${colors.yellow(`    !  ${text}`)}\n`
          // console.log(`    !  ${text}`);
        } else {
          messageResult += `    •  ${text}\n`
          // console.log(`    •  ${text}`);
        }
      }
    }

    return messageResult
  }

  public mergeValidationResults(results: ValidationResult[]): ValidationResult {
    let mergedType: ValidationType = results[0].type
    const mergedMessages: ValidationMessage[] = []

    for (let result of results) {
      switch (result.type) {
        case ValidationType.installed:
          if (mergedType === ValidationType.missing) {
            mergedType = ValidationType.partial
          }
          break
        case ValidationType.partial:
          mergedType = ValidationType.partial
          break
        case ValidationType.missing:
          if (mergedType === ValidationType.installed) {
            mergedType = ValidationType.partial
          }
          break
        default:
          break
      }
      mergedMessages.push(...result.messages)
    }
    return new ValidationResult(mergedType, mergedMessages, results[0].statusInfo)
  }
}

// A series of tools and required install steps for a target platform (iOS or Android).
export abstract class Workflow {
  // Whether the workflow applies to this platform (as in, should we ever try and use it).
  abstract get appliesToHostPlatform(): boolean

  // Are we functional enough to list devices?
  // abstract canListDevices(): boolean;

  // Could this thing launch *something*? It may still have minor issues.
  // abstract canLaunchDevices(): boolean;

  // Are we functional enough to list emulators?
  // abstract canListEmulators(): boolean;
}

export abstract class DoctorValidator {
  public title: string
  abstract validate()
}

export class ValidationMessage {
  constructor(public message: string, public isError = false, public isWaring = false) {
    this.message = message
    this.isError = isError
    this.isWaring = isWaring
  }
}
