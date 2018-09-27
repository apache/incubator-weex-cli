interface AndroidSdkOptions {
    sdkPath?: string;
    adbPath?: string;
}
declare class AndroidEnv {
    ANDROID_SDK_PATH: string | null;
    ANDROID_ADB_PATH: string | null;
    ANDROID_EMULATOR_PATH: string | null;
    private options;
    constructor(options?: AndroidSdkOptions);
    init(): void;
    getSdkPath(isThrowError?: boolean): string | null;
    getAdbPath(isThrowError?: boolean): string | null;
    getEmulatorPath(sdkPath?: string, isThrowError?: boolean): string;
    /**
     * Ndk is not necessary
     */
    getNdkPath(sdkPath?: string, isThrowError?: boolean): string;
}
export default AndroidEnv;
