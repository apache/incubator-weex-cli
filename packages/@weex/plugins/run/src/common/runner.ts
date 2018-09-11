import { PLATFORM_TYPES } from './const'
import WsServer from '../server/ws'

export interface UnifyRunnerConfig {
  /**
   * Will watch this folder *.js change
   */
  jsBundleFolderPath: string
}

export interface BaseRunnerConfig {
  /**
   * Will watch this folder *.js change
   */
  jsBundleFolderPath: string

  /**
   * Which file change trigger hot reload
   * Now only support one js bundle hot reload
   */
  jsBundleEntryPath: string

  /**
   * Weex Ios or Android project path
   */
  projectPath: string

  /**
   * Ios or Android device id
   */
  deviceId: string

  /**
   * Ios or Android application id
   */
  applicationId: string
}

export interface RunnerConfig extends BaseRunnerConfig {
  type: PLATFORM_TYPES

  wsServer?: WsServer
}

