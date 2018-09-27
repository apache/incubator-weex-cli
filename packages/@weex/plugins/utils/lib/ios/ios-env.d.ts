export default class IosEnv {
    isInstalledXcode(isThrowError?: boolean): boolean;
    getXcodeVersion(): string | null;
}
