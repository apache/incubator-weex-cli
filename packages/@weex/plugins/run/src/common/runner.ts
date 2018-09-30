export enum runnerState {
  start,
  startServerDone,
  setNativeConfigDone,
  copyJsBundleDone,
  watchFileChangeDone,
  buildNativeDone,
  installAndLaunchAppDone,
  done,
}

export enum messageType {
  state = 'state',
  outputLog = 'outputLog',
  outputError = 'outputError',
}

export interface RunnerConfig {
  /**
   * Will watch this folder *.js change
   */
  jsBundleFolderPath: string

  /**
   * Which file change trigger hot reload (path relative `jsBundleFolderPath`)
   * Now only support one js bundle hot reload
   */
  jsBundleEntry: string

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
