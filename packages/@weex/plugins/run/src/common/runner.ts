import { PLATFORM_TYPES } from './const'

export interface RunnerConfig {
  type: PLATFORM_TYPES

  /**
   * Weex project path
   */
  projectPath: string

  /**
   * Build js bundle cmd string
   * Default value: `npm run build`
   */
  buildJsCmd?: string

  /**
   * Weex Ios or Android project path
   * Default value:
   * IOS: `${projectPath}/platforms/ios`
   * Android: `${projectPath}/platforms/android`
   */
  nativePath?: string

  /**
   * The js bundle build path
   * Default value: `${projectPath}/dist/`
   */
  jsBuildPath?: string

}


export interface IosRunnerConfig extends RunnerConfig {

  //// (When isRealDevice is true) If want build xxx.app for real device need to set the following options
  isRealDevice?: boolean,

  /**
   * 开发者账号相关——开发者证书名称，分为开发证书和生产证书
   * ex: iPhone Developer: San Zhang (xxxxxxxxxx)
   */
  codeSignIndentity?: string,

  /**
   * 根据BundleIdentifier和CodeSignIndentity生成一个认证文件，将其下载到本地，输入该文件在本地的绝对路径
   * ex: /Users/YourName/Downloads/test.mobileprovision
   */

  mobileprovisionFilePath?: string
}
