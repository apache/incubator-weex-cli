import { AndroidWorkflow, AndroidValidator } from './android/android-workflow';
import { IOSWorkflow, IOSValidator } from './ios/ios-workflow'
import { isWindows } from '@weex-cli/utils/lib/platform/platform'

export class Doctor {
  public validators: DoctorValidator[] = []
  public iosWorkflow = new IOSWorkflow();
  public androidWorkflow = new AndroidWorkflow();

  constructor() {
    this.getValidators();
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
    const tasks = [];
    for (let validator of this.validators) {
      tasks.push(new ValidatorTask(validator, validator.validate()));
    }
    return tasks;
  }

  /**
   * diagnose 
   */
  public diagnose() {
    const taskList:ValidatorTask[] = this.startValidatorTasks();

    for (let validatorTask of taskList) {
      const validator:DoctorValidator = validatorTask.validator;
      const results:ValidationResult[] = [];
      let result:ValidationResult;
      results.push(validatorTask.result);
      result = this.mergeValidationResults(results);

      console.log(`${result.leadingBox} ${validator.title} is`)
      for (let message of result.messages) {
        const text = message.message.replace('\n', '\n      ');
        if (message.isError) {
          console.log(`    ✗  ${text}`);
        } else if (message.isWaring) {
          console.log(`    !  ${text}`);
        } else {
          console.log(`    •  ${text}`);
        }
      }
    }

  }

  public mergeValidationResults(results: ValidationResult[]): ValidationResult {
    let mergedType: ValidationType = results[0].type;
    const mergedMessages: ValidationMessage[] = [];

    for(let result of results) {
      switch(result.type) {
        case ValidationType.installed:
          if (mergedType === ValidationType.missing) {
            mergedType = ValidationType.partial;
          }
          break;
        case ValidationType.partial:
          mergedType = ValidationType.partial;
          break;
        case ValidationType.missing:
          if (mergedType === ValidationType.installed) {
            mergedType = ValidationType.partial;
          }
          break;
        default:
          break;
      }
      mergedMessages.push(...result.messages);
    }
    return new ValidationResult(mergedType, mergedMessages, results[0].statusInfo);
  }
}

export class ValidationResult {
  /// [ValidationResult.type] should only equal [ValidationResult.installed]
  /// if no [messages] are hints or errors.
  constructor(public type: ValidationType, public messages: ValidationMessage[], public statusInfo?: string){
    this.type = type;
    this.messages = messages;
  }

  get leadingBox(): String {
    switch (this.type) {
      case ValidationType.missing:
        return '[✗]';
      case ValidationType.installed:
        return '[✓]';
      case ValidationType.partial:
        return '[!]';
    }
    return null;
  }
}

class ValidatorTask {
  constructor(public validator: DoctorValidator, public result: ValidationResult) {
    this.validator = validator;
    this.result = result;
  }
}

export const enum ValidationType {
  missing,
  partial,
  installed,
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
  public title: string;
  abstract validate()
}

export class ValidationMessage {
  constructor(public message: string, public isError = false, public isWaring = false) {
    this.message = message;
    this.isError = isError;
    this.isWaring = isWaring;
  }
}
