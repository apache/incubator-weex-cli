import { Workflow, ValidationType, ValidationMessage, ValidationResult, DoctorValidator } from '../doctor';
import {  } from './android-sdk';

export class AndroidWorkflow implements Workflow {
  get appliesToHostPlatform():boolean {
    return true;
  }
}

export const androidWorkflow = new AndroidWorkflow();

export class AndroidValidator implements DoctorValidator {
  public messages: ValidationMessage[] = [];

  public validate () {
    // android-sdk
    if (!AndroidSdkValue) {

    }

  }

}