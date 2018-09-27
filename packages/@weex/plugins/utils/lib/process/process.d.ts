export declare function runAndGetOutput(cmdString: string, options?: {}): any;
/**
 * Convert a object to cmd string for `exec` use
 * @param cmdName
 * @param params
 */
export declare function createCmdString(cmdName: string, params: object): string;
export interface ExecOptions {
    onOutCallback?: Function;
    onErrorCallback?: Function;
    onCloseCallback?: Function;
    handleChildProcess?: Function;
}
export declare function exec(cmdString: string, options?: ExecOptions, nativeExecOptions?: any): Promise<any>;
export declare function runAsync(command: string, args?: string[]): Promise<any>;
export declare function which(execName: any, args?: any[]): string[];
