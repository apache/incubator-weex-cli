import WsServer from './server/ws'
import { UnifyRunnerConfig, BaseRunnerConfig } from './common/runner'
import IosRunner from './ios/ios-runner'
import AndroidRunner from './android/android-runner'
import { PLATFORM_TYPES } from './common/const'

export default class UnifyRunner {
  private wsServer: any
  private config: UnifyRunnerConfig

  constructor(options?: UnifyRunnerConfig) {
    this.config = Object.assign(options, {
      // Some default
    })
  }

  private startServer() {
    if (this.wsServer) {
      return
    }
    const config = this.config
    this.wsServer = new WsServer({
      staticFolder: config.jsBundleFolderPath
    })
  }

  runIos(options: BaseRunnerConfig): Promise<any> {
    this.startServer()
    const iosRunner = new IosRunner(Object.assign(
      options, {
        type: PLATFORM_TYPES.ios,
        wsServer: this.wsServer
      }
    ))

    return iosRunner.run()
  }

  runAndroid(options: BaseRunnerConfig): Promise<any> {
    const androidRunner = new AndroidRunner(Object.assign(
      options, {
        type: PLATFORM_TYPES.android,
        wsServer: this.wsServer
      }
    ))

    return androidRunner.run()
  }
}