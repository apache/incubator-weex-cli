export declare class XcodeProjectInterpreter {
    private executable;
    versionText: string;
    versionRegex: RegExp;
    majorVersion: number;
    minorVersion: number;
    constructor();
    updateVersion(): void;
    readonly isInstalled: boolean;
}
