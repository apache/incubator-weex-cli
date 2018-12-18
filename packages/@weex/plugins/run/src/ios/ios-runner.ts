import { IosBuilder } from '@weex-cli/build'
import { IosDevices } from '@weex-cli/device'
import Runner from '../base/runner'
import { RunnerConfig } from '../common/runner'
import ConfigResolver from '../common/config'
import { PLATFORM_TYPES } from '../common/const'
import * as DEBUG from 'debug'

const debug = DEBUG('run')
export default class IosRunner extends Runner {
  protected config: RunnerConfig

  constructor(options: RunnerConfig) {
    super(options, PLATFORM_TYPES.ios)
  }

  async setNativeConfig() {
    const config = this.config
    const wsServer = this.wsServer
    const serverInfo = wsServer.getServerInfo()
    ConfigResolver[this.type].resolve(
      Object.assign(
        {
          Ws: `ws://${serverInfo.hostname}:${serverInfo.port}`,
          port: serverInfo.port,
          ip: serverInfo.hostname,
          platform: PLATFORM_TYPES.ios,
        },
        config.nativeConfig,
      ),
      config.projectPath,
    )
  }

  async buildNative(options: any = {}) {
    const config = this.config

    const iosBuilder = new IosBuilder({
      projectPath: config.projectPath,
      preCmds: ['pod update'],
    })
    this.transmitEvent(iosBuilder)
    const { appPath } = await iosBuilder.run(
      Object.assign(
        {
          onOutCallback: outString => {
            debug('BUILD OUTPUT:', outString)
          },
          onErrorCallback: outString => {
            debug('BUILD ERROR:', outString)
          },
        },
        options,
      ),
    )
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
