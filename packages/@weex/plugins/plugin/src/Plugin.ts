import utils from './utils'
import * as fs from 'fs-extra'
import * as path from 'path'

export default class Plugin {

  private shouldInstallPackage: boolean = false

  installInPackage (dir, pluginName, version, result) {
    console.log(dir, pluginName, version, result)
  }
  
  handleInstall (dir, pluginName, version, option) {
  
    if (option.web) {
      // should install npm package into project or not.
      this.shouldInstallPackage = true
    }
  }

  installNewPlugin = (dir, pluginName, version) => {
    let result: any = utils.isNewVersionPlugin(pluginName, version)

    if (result) {
      this.handleInstall(dir, pluginName, version, result)
      if (this.shouldInstallPackage) {
        this.installInPackage(dir, pluginName, version, result)
      }
    }
    else {
      console.log(`This package of weex is not support anymore! Please choose other package.`)
    }
  }

  install (pluginName: string) {
    let version
    if (/@/ig.test(pluginName)) {
      const temp = pluginName.split('@')
      pluginName = temp[0]
      version = temp[1]
    }
    const dir = process.cwd()
    // get the lastest version
    if (!version) {
      npmHelper.getLastestVersion(pluginName, function (version) {
        this.installNewPlugin(dir, pluginName, version)
      })
    }
    else {
      this.installNewPlugin(dir, pluginName, version)
    }
  }

  uninstall () {

  }

  installForNewPlatform () {

  }

}