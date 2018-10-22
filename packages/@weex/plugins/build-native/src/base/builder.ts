import * as EventEmitter from 'events'
import { BuilderConfig, RunOptions, messageType } from '../common/builder'
import { PLATFORM_TYPES } from '../common/const'
import { exec } from '@weex-cli/utils/lib/process/process.js'

export default class Builder extends EventEmitter {
  public type: PLATFORM_TYPES
  protected config: BuilderConfig

  constructor(options: BuilderConfig, type: PLATFORM_TYPES) {
    super()
    this.checkEnv()
    this.init(options)
    this.on('error', e => {
      // To prevent the collapse
      this.emit(messageType.outputError, e)
    })
    this.type = type
  }

  protected checkEnv() {
    // Do nothing
  }

  private init(options: BuilderConfig) {
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
      await exec(preCmds[i], {}, { cwd: this.config.projectPath })
    }
  }

  public async run(options: RunOptions): Promise<{ appPath: string }> {
    console.error('Not define `buildNative`')
    return null
  }
}
