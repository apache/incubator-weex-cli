import { Workflow, ValidationType, ValidationMessage, ValidationResult, DoctorValidator } from '../doctor';
import { Xcode } from '@weex-cli/utils/lib/ios/mac';
import { CocoaPods } from '@weex-cli/utils/lib/ios/cocoapods';
export declare class IOSWorkflow implements Workflow {
    readonly appliesToHostPlatform: boolean;
    getPlistValueFromFile(path: string, key: string): string;
}
export declare class IOSValidator implements DoctorValidator {
    messages: ValidationMessage[];
    xcodeStatus: ValidationType;
    brewStatus: ValidationType;
    xcodeVersionInfo: string;
    title: string;
    cocoaPods: CocoaPods;
    xcode: Xcode;
    constructor();
    readonly hasHomebrew: boolean;
    readonly hasIDeviceInstaller: boolean;
    readonly hasIosDeploy: boolean;
    readonly iosDeployVersionText: string;
    readonly iosDeployMinimumVersion: string;
    readonly iosDeployIsInstalledAndMeetsVersionCheck: boolean;
    validate(): ValidationResult;
    private mergeValidationTypes;
}
