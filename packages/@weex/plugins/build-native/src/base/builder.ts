const path = require('path')

import { BuilderConfig } from '../common/builder'
import { PLATFORM_TYPES } from '../common/const'
import { exec } from '../utils/process'

export default class Builder {
  public type: PLATFORM_TYPES
  protected config: BuilderConfig

  constructor(options: BuilderConfig) {
    this.init(options)
  }

  private init(options: BuilderConfig) {
    const { type } = options
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

  protected async doPreCmds() {
    const { preCmds } = this.config

    if (!preCmds || preCmds.length < 1) {
      return
    }

    for (let i = 0; i < preCmds.length; i++) {
      await exec(preCmds[i])
    }
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
