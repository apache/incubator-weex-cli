import { IosBuilder } from '@weex-cli/build-native'
import { IosDevices } from '@weex-cli/device'
import Runner from '../base/runner'
import { RunnerConfig } from '../common/runner'
import CONFIG from '../common/config'
import { PLATFORM_TYPES } from '../common/const'

export default class IosRunner extends Runner {
  protected config: RunnerConfig

  constructor(options: RunnerConfig) {
    super(options, PLATFORM_TYPES.ios)
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
      projectPath: config.projectPath,
      preCmds: ['pod update'],
    })
    this.transmitEvent(iosBuilder)
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
    const iosDevice = new IosDevices()
    this.transmitEvent(iosDevice)
    await iosDevice.run({
      id: config.deviceId,
      applicationId: config.applicationId,
      appPath,
    })
  }
}
