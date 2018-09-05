const path = require('path')

import { BuilderConfig } from '../common/builder'
import { PLATFORM_TYPES } from '../common/const'

export default class Builder {
  public type: PLATFORM_TYPES
  protected config: BuilderConfig

  constructor(options: BuilderConfig) {
    this.init(options)
  }

  private init(options: BuilderConfig) {
    const { projectPath, type } = options
    this.type = type
    this.config = Object.assign(
      {
        // Some default
      },
      options,
    )
  }

  protected buildNative() {
    console.error('Not define `buildNative`')
  }

  public async run(): Promise<{ appPath: string }> {
    let appPath
    try {
      // All method catch in here
      appPath = await this.buildNative()
    } catch (error) {
      throw error
    }
    return {
      appPath
    }
  }
}
