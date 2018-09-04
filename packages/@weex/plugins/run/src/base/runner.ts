const path = require('path')
const { exec, execSync } = require('child_process')

import { RunnerConfig } from '../common/runner'
import { PLATFORM_TYPES } from '../common/const'

export default class Runner {
  public type: PLATFORM_TYPES
  protected config: RunnerConfig

  constructor(options: RunnerConfig) {
    this.init(options)
  }

  private init(options: RunnerConfig) {
    const { projectPath, type } = options
    this.type = type
    this.config = Object.assign(
      {
        nativePath:
          this.type === PLATFORM_TYPES.ios
            ? path.join(projectPath, 'platforms/ios')
            : path.join(projectPath, 'platforms/android'),
        buildJsCmd: `npm run build`,
      },
      options,
    )
  }

  protected buildJs() {
    // execSync(this.config.buildJsCmd)
  }

  protected watchFileChange() {
    // TODO
  }

  protected buildNative() {
    console.error('Not define `updateList`')
  }

  protected installApp() {
    // TODO
  }

  public async run(): Promise<{ appPath: string }> {
    let appPath
    try {
      // All method catch in here
      await this.buildJs()
      appPath = await this.buildNative()
      await this.watchFileChange()
      await this.installApp()
    } catch (error) {
      throw error
    }
    return {
      appPath
    }
  }
}
