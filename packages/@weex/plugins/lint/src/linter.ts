import { CLIEngine } from 'eslint'

export default class WeexLinter {
  private engine: CLIEngine

  private defaultOptions: CLIEngine.Options = {
    useEslintrc: false,
    extensions: ['.js', '.vue'],
    baseConfig: {
      extends: ['eslint-config-weex/vue'],
    },
  }

  constructor(options: CLIEngine.Options) {
    this.engine = new CLIEngine(Object.assign(options, this.defaultOptions))
  }

  public executeOnFiles(files) {
    return this.engine.executeOnFiles(files)
  }

  public executeOnText(sourcecode) {
    return this.engine.executeOnText(sourcecode)
  }

  public getConfigForFile(printConfig) {
    return this.engine.getConfigForFile(printConfig)
  }

  public outputFixes(report) {
    return CLIEngine.outputFixes(report)
  }

  public getErrorResults(report) {
    return CLIEngine.getErrorResults(report)
  }

  public getFormatter(code) {
    return this.engine.getFormatter(code)
  }
}
