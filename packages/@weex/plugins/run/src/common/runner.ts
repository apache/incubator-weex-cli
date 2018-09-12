import { PLATFORM_TYPES } from './const'

export interface RunnerConfig {
  type: PLATFORM_TYPES,

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

  /**
   *  The content of `ios.config.json` or 'android.config.json'
   */
  nativeConfig?: any
}

