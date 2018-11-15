import { IOSWorkflow } from '../ios/ios-workflow';
import { VersionOption } from '@weex-cli/utils/lib/base/version';
interface ValidOption {
    configured?: string;
    version?: VersionOption;
}
export declare class AndroidStudioValid {
    directory: string;
    option?: ValidOption;
    isValid: boolean;
    validationMessages: string[];
    configured: string;
    javaPath: string;
    version: VersionOption;
    constructor(directory: string, option?: ValidOption);
    init(): void;
}
export declare class AndroidStudio {
    javaPath: string;
    iosWorkflow: IOSWorkflow;
    constructor();
    latestValid(): void;
    allInstalled(): AndroidStudioValid[];
    allMacOS(): AndroidStudioValid[];
    checkForStudio(path: string): string[];
    fromMacOSBundle(bundlePath: string): AndroidStudioValid;
    fromHomeDot(homeDotDir: any): AndroidStudioValid;
    allLinuxOrWindows(): AndroidStudioValid[];
}
export {};
