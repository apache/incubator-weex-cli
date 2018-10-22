export interface DeviceInfo {
  name: string
  id: string
  isSimulator: Boolean
  version?: string
}

export enum messageType {
  state = 'state',
  outputLog = 'outputLog',
  outputError = 'outputError',
}

export interface RunDeviceOptions {
  /**
   * DeviceInfo.id
   */
  id: string

  /**
   * For ios is `xxx.app` path, if install in real machine the `xxx.app` should auth first
   * For android is `xxx.apk` path
   */
  appPath: string

  /**
   * The id used to launch the application
   * For ios is `BundleIdentifier` ex: com.alibaba.weex
   * For android is `packageName` ex: com.weex.app
   */
  applicationId: string

  /**
   * After star the app some command string of `shell`
   * ex: -d Ws:http://102.323.33:8080
   */
  androidShellCmdString?: string
}
