import { AndroidWorkflow } from './android/android-workflow';
import { IOSWorkflow } from './ios/ios-workflow';
export declare class Doctor {
    validators: DoctorValidator[];
    iosWorkflow: IOSWorkflow;
    androidWorkflow: AndroidWorkflow;
    constructor();
    getValidators(): void;
    startValidatorTasks(): any[];
    /**
     * diagnose
     */
    diagnose(): string;
    mergeValidationResults(results: ValidationResult[]): ValidationResult;
}
export declare class ValidationResult {
    type: ValidationType;
    messages: ValidationMessage[];
    statusInfo: string;
    constructor(type: ValidationType, messages: ValidationMessage[], statusInfo?: string);
    readonly leadingBox: String;
}
export declare const enum ValidationType {
    missing = 0,
    partial = 1,
    installed = 2,
}
export declare abstract class Workflow {
    readonly abstract appliesToHostPlatform: boolean;
}
export declare abstract class DoctorValidator {
    title: string;
    abstract validate(): any;
}
export declare class ValidationMessage {
    message: string;
    isError: boolean;
    isWaring: boolean;
    constructor(message: string, isError?: boolean, isWaring?: boolean);
}
