import { Workflow, ValidationMessage, ValidationResult, DoctorValidator } from '../doctor';
import { AndroidSdk } from './android-sdk';
export declare class AndroidWorkflow implements Workflow {
    readonly appliesToHostPlatform: boolean;
}
export declare class AndroidValidator implements DoctorValidator {
    title: string;
    messages: ValidationMessage[];
    androidSdk: AndroidSdk;
    constructor();
    validate(): ValidationResult;
    checkJavaVersion(javaBinary: any): boolean;
    licensesAccepted(): void;
}
