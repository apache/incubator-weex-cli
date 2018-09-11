const path = require('path')
const copy = require('recursive-copy')
const fs = require('fs')

import { RunnerConfig } from '../common/runner'
import { PLATFORM_TYPES } from '../common/const'


export default class Runner {
  private filesWatcher
  public type: PLATFORM_TYPES
  protected config: RunnerConfig

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

  protected setNativeConfig() {
    // TODO
    return true
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
    await copy(path.join(jsBundleFolderPath), path.join(projectPath, 'bundlejs/'), options)
  }

  protected watchFileChange() {
    const config = this.config

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
        if (name === config.jsBundleEntryPath) {
          const wsServer = config.wsServer
          const serverInfo = wsServer.getServerInfo()
          wsServer.getWsServer().send(JSON.stringify({
            method: 'WXReloadBundle',
            params: `http://${serverInfo.hostname}:${serverInfo.port}/${config.jsBundleEntryPath}`
          }))
        }
      }
    )
  }

  protected buildNative() {
    console.error('Not define `updateList`')
  }

  protected installAndLaunchApp(appPath: string) {
    console.error('Not define `installAndLaunchApp`')
  }

  public async run() {
    let appPath
    try {
      // All method catch in here
      // await this.setNativeConfig()
      // await this.copyJsBundle()
      // this.watchFileChange()
      appPath = await this.buildNative()
      await this.installAndLaunchApp(appPath)
    } catch (error) {
      throw error
    }
  }
}
