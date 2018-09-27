import { PLATFORM_TYPES } from './const'
import { ExecOptions } from '@weex-cli/utils/lib/process/process.js'

export interface BuilderConfig {
  type: PLATFORM_TYPES

  /**
   * Ios or Android project path
   */
  projectPath: string

  /**
   * Before Build some cmd, just like `['pod update']`
   */
  preCmds?: Array<string>
}

export interface IosBuilderConfig extends BuilderConfig {
  /**
   * Build for real device or not
   */
  isRealDevice?: boolean
}

export interface AndroidBuilderConfig extends BuilderConfig {
  /**
   * The build android apk location, set in gradle config
   * If not set apkPth will try find  `app/build/outputs/apk/*.apk`
   */
  apkPath?: string
}

export interface RunOptions extends ExecOptions {}
