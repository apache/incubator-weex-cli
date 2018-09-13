import Runner from '../base/runner'
import { RunnerConfig } from '../common/runner'
import { IosBuilder } from '@weex-cli/build-native'
import { installAndLaunchIosApp } from '@weex-cli/device'
import CONFIG from '../common/config'

export default class IosRunner extends Runner {
  protected config: RunnerConfig

  constructor(options: RunnerConfig) {
    super(options)
  }

  async setNativeConfig() {
    const config = this.config
    const wsServer = this.wsServer
    const serverInfo = wsServer.getServerInfo()
    CONFIG[this.type].resolve(
      Object.assign(
        {
          Ws: `ws://${serverInfo.hostname}:${serverInfo.port}`,
          port: serverInfo.port,
          ip: serverInfo.hostname,
        },
        config.nativeConfig,
      ),
      config.projectPath,
    )
  }

  async buildNative() {
    const config = this.config

    const iosBuilder = new IosBuilder({
      type: config.type,
      projectPath: config.projectPath,
      preCmds: ['pod update'],
    })
    const { appPath } = await iosBuilder.run({
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
    await installAndLaunchIosApp({
      id: config.deviceId,
      applicationId: config.applicationId,
      appPath,
    })
  }
}
