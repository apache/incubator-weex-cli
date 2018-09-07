const path = require('path')

import { BuilderConfig, RunOptions } from '../common/builder'
import { PLATFORM_TYPES } from '../common/const'
import { exec } from '@weex-cli/utils/src/process/process'


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

  protected async doPreCmds() {
    const { preCmds } = this.config

    if (!preCmds || preCmds.length < 1) {
      return
    }

    for (let i = 0; i < preCmds.length; i++) {
      await exec(preCmds[i])
    }
  }

  public async run(options: RunOptions): Promise<{ appPath: string }> {
    console.error('Not define `buildNative`')
    return null
  }
}
