import { VersionOption } from '@weex-cli/utils/lib/base/version';
import { AndroidStudio } from './android-studio';
export declare const kAndroidHome: String;
export declare const mustAndroidSdkVersion: number;
export declare class AndroidSdkVersion {
    sdk: AndroidSdk;
    sdkLevel: number;
    platformName: string;
    buildToolsVersion: VersionOption;
    constructor(sdk: AndroidSdk, sdkLevel: number, platformName: string, buildToolsVersion: VersionOption);
    readonly buildToolsVersionName: string;
    readonly androidJarPath: string;
    readonly aaptPath: string;
    getPlatformsPath(itemName: string): string;
    getBuildToolsPath(binaryName: string): string;
    validateSdkWellFormed(): string[];
    exists(path: string): string;
    canRun(path: string, args?: string[]): string;
}
export declare class AndroidSdk {
    directory: string;
    sdkVersions: AndroidSdkVersion[];
    latestVersion: AndroidSdkVersion;
    androidStudio: AndroidStudio;
    isMustAndroidSdkVersion: boolean;
    constructor();
    readonly adbPath: string;
    readonly sdkManagerPath: string;
    findJavaBinary(): string;
    getPlatformToolsPath(binaryName: string): string;
    validateSdkWellFormed(): string[];
    locateAndroidSdk(): void;
    findAndroidHomeDir(): string;
    validSdkDirectory(dir: any): boolean;
    init(): void;
}
