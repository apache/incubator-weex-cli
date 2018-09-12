const path = require('path')
const copy = require('recursive-copy')
const fs = require('fs')

import { RunnerConfig } from '../common/runner'
import { PLATFORM_TYPES } from '../common/const'
import WsServer from '../server/ws'
import { FSWatcher } from 'fs'

export default class Runner {
  public type: PLATFORM_TYPES
  protected config: RunnerConfig
  protected filesWatcher: FSWatcher
  protected wsServer: WsServer


  constructor(options: RunnerConfig) {
    this.init(options)
  }

  private init(options: RunnerConfig) {
    const { type } = options
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
      staticFolder: config.jsBundleFolderPath
    })
    await this.wsServer.init()
  }


  protected setNativeConfig() {
    console.error('Not define `setNativeConfig`')
  }

  protected async copyJsBundle() {
    const options = {
      filter: [
        '**/*.js',
        '!**/*.web.js'
      ],
      overwrite: true
    }
    const { jsBundleFolderPath, projectPath } = this.config
    if (PLATFORM_TYPES.ios) {
      await copy(path.join(jsBundleFolderPath), path.join(projectPath, 'bundlejs/'), options)
    }
    if (PLATFORM_TYPES.android) {
      await copy(path.join(jsBundleFolderPath), path.join(projectPath, 'app/src/main/assets/'), options)
    }
  }

  protected watchFileChange() {
    const config = this.config
    const entryFileName = path.basename(config.jsBundleEntryPath)

    if (this.filesWatcher) {
      this.filesWatcher.close()
    }
    this.filesWatcher = fs.watch(
      this.config.jsBundleFolderPath,
      {
        recursive: true
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
          ws.send(JSON.stringify({
            method: 'WXReloadBundle',
            params: `http://${serverInfo.hostname}:${serverInfo.port}/${entryFileName}`
          }))
        }
      }
    )
    return true
  }

  protected buildNative() {
    console.error('Not define `updateList`')
  }

  protected installAndLaunchApp(appPath: string) {
    console.error('Not define `installAndLaunchApp`')
  }

  public async run(): Promise<any> {
    let appPath
    try {
      // All method catch in here
      await this.startServer()
      await this.setNativeConfig()
      await this.copyJsBundle()
      await this.watchFileChange()
      appPath = await this.buildNative()
      await this.installAndLaunchApp(appPath)
    } catch (error) {
      throw error
    }
  }

  public dispose () {
    this.filesWatcher.close()
    this.wsServer.dispose()
  }
}
