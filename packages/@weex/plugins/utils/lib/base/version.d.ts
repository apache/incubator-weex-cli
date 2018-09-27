export declare const versionPattern: RegExp;
export interface VersionOption {
    major: number;
    minor: number;
    patch: number;
}
export declare function versionParse(text: string): VersionOption;
/**
 * check non-negative version
 * @param version
 */
export declare function versionNonNegative(version: VersionOption): boolean;
export declare function compareVersion(version: VersionOption, otherVersion: VersionOption): boolean;
