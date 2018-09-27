import Runner from '../base/runner'
import { RunnerConfig } from '../common/runner'
import { AndroidBuilder } from '@weex-cli/build-native'
import { installAndLaunchAndroidApp } from '@weex-cli/device'
import CONFIG from '../common/config'
import { PLATFORM_TYPES } from '../common/const'

export default class IosRunner extends Runner {
  protected config: RunnerConfig

  constructor(options: RunnerConfig) {
    super(options, PLATFORM_TYPES.android)
  }

  async setNativeConfig() {
    const config = this.config

    CONFIG[this.type].resolve(
      Object.assign(
        {
          // Some special config
        },
        config.nativeConfig,
      ),
      config.projectPath,
    )
  }

  async buildNative() {
    const config = this.config
    const androidBuilder = new AndroidBuilder({
      projectPath: config.projectPath
    })
    const { appPath } = await androidBuilder.run({
      onOutCallback: outString => {
        console.log('BUILD OUTPUT:', outString)
      },
      onErrorCallback: outString => {
        console.error('BUILD ERROR:', outString)
      },
    })
    return appPath
  }

  async installAndLaunchApp(appPath) {
    const config = this.config
    const wsServer = this.wsServer
    const serverInfo = wsServer.getServerInfo()

    await installAndLaunchAndroidApp({
      id: config.deviceId,
      applicationId: config.applicationId,
      appPath,
      androidShellCmdString: `-d ${this.stringifyConfigs({ Ws: `ws://${serverInfo.hostname}:${serverInfo.port}` })}`,
    })
  }

  private stringifyConfigs(configs) {
    let str = "'{"
    for (const key in configs) {
      if (configs.hasOwnProperty(key)) {
        str += '\\"'
        str += key
        str += '\\":'
        str += '\\"'
        str += configs[key]
        str += '\\",'
      }
    }
    str = str.slice(0, -1)
    str += "}'"
    return str
  }
}
