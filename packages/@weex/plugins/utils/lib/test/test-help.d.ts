/**
 * Help get test config and show warning
 * `test.config.json` is in project root path
 */
export default class TestHelp {
    private projectPath;
    private config;
    constructor(projectPath: any);
    getTestConfig(): any;
    getTestConfigByKey(key: string, keyExplain?: string): any;
}
