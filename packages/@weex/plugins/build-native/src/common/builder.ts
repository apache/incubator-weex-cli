import { PLATFORM_TYPES } from './const'

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

