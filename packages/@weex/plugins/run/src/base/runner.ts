const path = require('path')
const copy = require('recursive-copy')
const fs = require('fs')

import * as EventEmitter from 'events'
import { RunnerConfig, runnerState, messageType } from '../common/runner'
import { PLATFORM_TYPES } from '../common/const'
import WsServer from '../server/ws'
import { FSWatcher } from 'fs'

export default class Runner extends EventEmitter {
  public type: PLATFORM_TYPES
  protected config: RunnerConfig
  protected filesWatcher: FSWatcher
  protected wsServer: WsServer

  constructor(options: RunnerConfig, type: PLATFORM_TYPES) {
    super()
    this.on('error', e => {
      // To prevent the collapse
      console.error(e)
    })
    this.checkEnv()
    this.init(options, type)
  }

  private init(options: RunnerConfig, type: PLATFORM_TYPES) {
    this.type = type
    this.config = Object.assign(
      {
        // Some default options
      },
      options,
    )
  }

  private async startServer() {
    if (this.wsServer) {
      return this.wsServer
    }
    const config = this.config
    this.wsServer = new WsServer({
      staticFolder: config.jsBundleFolderPath,
    })
    await this.wsServer.init()
  }

  protected checkEnv() {
    // Do nothing
  }

  protected transmitEvent(outEvent) {
    outEvent.on(messageType.outputError, message => {
      this.emit(messageType.outputError, message)
    })
    outEvent.on(messageType.outputLog, message => {
      this.emit(messageType.outputLog, message)
    })
  }

  protected async setNativeConfig() {
    console.error('Not define `setNativeConfig`')
  }

  protected async copyJsBundle() {
    const options = {
      filter: ['**/*.js', '!**/*.web.js'],
      overwrite: true,
    }
    const { jsBundleFolderPath, projectPath } = this.config
    if (PLATFORM_TYPES.ios) {
      await copy(path.join(jsBundleFolderPath), path.join(projectPath, 'bundlejs/'), options)
    }
    if (PLATFORM_TYPES.android) {
      await copy(path.join(jsBundleFolderPath), path.join(projectPath, 'app/src/main/assets/dist'), options)
    }
  }

  protected watchFileChange() {
    const config = this.config
    const entryFileName = config.jsBundleEntry

    if (this.filesWatcher) {
      this.filesWatcher.close()
    }
    this.filesWatcher = fs.watch(
      this.config.jsBundleFolderPath,
      {
        recursive: true,
      },
      (type, name) => {
        if (/\w*\.web\.js$/.test(name)) {
          return
        }
        if (name === entryFileName) {
          const wsServer = this.wsServer
          const serverInfo = wsServer.getServerInfo()
          const ws = wsServer.getWs()
          if (!ws) {
            return
          }
          ws.send(
            JSON.stringify({
              method: 'WXReloadBundle',
              params: `http://${serverInfo.hostname}:${serverInfo.port}/${entryFileName}`,
            }),
          )
        }
      },
    )
    return true
  }

  protected async buildNative(options?: any) {
    console.error('Not define `updateList`')
  }

  protected async installAndLaunchApp(appPath: string) {
    console.error('Not define `installAndLaunchApp`')
  }

  public async run(options?: any): Promise<any> {
    let appPath
    try {
      // All method catch in here
      this.emit(messageType.state, runnerState.start)
      await this.startServer()
      this.emit(messageType.state, runnerState.startServerDone)

      await this.setNativeConfig()
      this.emit(messageType.state, runnerState.setNativeConfigDone)

      await this.copyJsBundle()
      this.emit(messageType.state, runnerState.copyJsBundleDone)

      this.watchFileChange()
      this.emit(messageType.state, runnerState.watchFileChangeDone)

      appPath = await this.buildNative(options)
      this.emit(messageType.state, runnerState.buildNativeDone)

      await this.installAndLaunchApp(appPath)
      this.emit(messageType.state, runnerState.installAndLaunchAppDone)

      this.emit(messageType.state, runnerState.done)
    } catch (error) {
      throw error
    }
  }

  public dispose() {
    this.filesWatcher.close()
    this.wsServer.dispose()
  }
}
