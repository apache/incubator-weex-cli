import { XcodeProjectInterpreter } from './xcodeproj';
export declare const XcodeRequiredVersionMajor = 9;
export declare const XcodeRequiredVersionMinor = 0;
export declare function xcodeSelectPath(): string;
export declare function isXcodeInstalled(): boolean;
export declare class Xcode {
    xcodeSelectPath: string;
    XcodeProjectInterpreter: XcodeProjectInterpreter;
    constructor();
    getXcodeSelectPath(): void;
    readonly isInstalled: boolean;
    readonly versionText: string;
    readonly majorVersion: number;
    readonly minorVersion: number;
    readonly isVersionSatisfactory: boolean;
    readonly isInstalledAndMeetsVersionCheck: boolean;
    readonly eulaSigned: boolean;
    /**
     * if additional components need to be installed in
     */
    readonly isSimctlInstalled: boolean;
}
export declare const xcode: Xcode;
export declare class IMobileDevice {
    readonly isInstalled: boolean;
    readonly isWorking: boolean;
}
