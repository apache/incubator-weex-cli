/* Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import utils from './utils'
import * as fse from 'fs-extra'
import * as path from 'path'
import * as xcode from 'xcode'
import * as merge from 'merge'
import * as colors from 'colors'
import * as plist from 'plist'
import * as EventEmitter from 'events'
import { LOGLEVEL } from './log-types'
import Config from './config'
import npmHelper from './utils/npm-helper'
import podfile from './utils/podfile'

export default class Plugin extends EventEmitter {
  private shouldInstallPackage: boolean = false
  private shouldUninstallPackage: boolean = false
  private config: Config
  private pluginConfigs: any
  private pluginConfigPath: string
  private androidPluginConfigs: any[]
  private androidPluginConfigPath: string
  constructor(config?: any) {
    super()
    this.config = new Config(config)
    this.pluginConfigs = this.config.defaultConfig
    // Get plugin config in project.
    this.pluginConfigPath = path.join(this.config.rootPath, this.config.filename)
    if (fse.existsSync(this.pluginConfigPath)) {
      this.pluginConfigs = JSON.parse(fse.readFileSync(this.pluginConfigPath))
    }
    this.androidPluginConfigs = []
    // Get plugin config in android project.
    this.androidPluginConfigPath = path.join(this.config.androidPath, this.config.androidConfigFilename)
    if (fse.existsSync(this.androidPluginConfigPath)) {
      this.androidPluginConfigs = JSON.parse(fse.readFileSync(this.androidPluginConfigPath))
    }
  }

  async installInPackage(dir, pluginName, version, option) {
    const packageFilePath = path.join(dir, 'package.json')
    this.emit(LOGLEVEL.LOG, 'Downloading plugin...')
    if (fse.existsSync(packageFilePath)) {
      const pkg = require(packageFilePath)
      pkg.dependencies[pluginName] = version
      fse.writeJson(packageFilePath, pkg, { spaces: '\t' })
    }
    await utils.installNpmPackage()
    const browserPluginName = option.web && option.web.name ? option.web.name : pluginName
    if (option.web) {
      this.emit(LOGLEVEL.LOG, `Update plugins.json...`)
      // Update plugin.json in the project.
      this.pluginConfigs = utils.updatePluginConfigs(this.pluginConfigs, browserPluginName, option, 'web')
      await utils.writePluginFile(this.config.rootPath, this.pluginConfigPath, this.pluginConfigs)
      this.emit(LOGLEVEL.LOG, `Building plugins...`)
      try {
        await utils.buildJS('build:plugin', true)
        this.emit(LOGLEVEL.SUCCESS, `Building plugins successful.`)
      } catch (error) {
        this.emit(LOGLEVEL.ERROR, error)
      }
    }
  }

  installPList(projectRoot, projectPath, config) {
    const xcodeproj = xcode.project(projectPath)
    xcodeproj.parseSync()
    const xcBuildConfiguration = xcodeproj.pbxXCBuildConfigurationSection()
    let plistFileEntry
    let plistFile
    for (const p in xcBuildConfiguration) {
      const entry = xcBuildConfiguration[p]
      if (entry.buildSettings && entry.buildSettings.INFOPLIST_FILE) {
        plistFileEntry = entry
        break
      }
    }
    if (plistFileEntry) {
      plistFile = path.join(
        projectRoot,
        plistFileEntry.buildSettings.INFOPLIST_FILE.replace(/^"(.*)"$/g, '$1').replace(/\\&/g, '&'),
      )
    }

    if (!fse.existsSync(plistFile)) {
      this.emit(LOGLEVEL.ERROR, 'Could not find *-Info.plist file')
    } else {
      let obj = plist.parse(fse.readFileSync(plistFile, 'utf8'))
      obj = merge.recursive(true, obj, config)
      fse.writeFileSync(plistFile, plist.build(obj))
    }
  }

  async handleInstall(dir, pluginName, version, option) {
    if (option.web) {
      // should install npm package into project or not.
      this.shouldInstallPackage = true
    }
    // check out the type of current project
    if (utils.isIOSProject(dir)) {
      const project: any = utils.isIOSProject(dir)
      if (!fse.existsSync(path.join(dir, project.name, 'Podfile'))) {
        this.emit(LOGLEVEL.ERROR, "can't find Podfile file")
        return
      }
      const iosPackageName = option.ios && option.ios.name ? option.ios.name : pluginName

      if (option.ios && option.ios.plist) {
        let projectPath
        if (!project.isWorkspace) {
          projectPath = path.join(dir, project.name, 'project.pbxproj')
        }
        this.installPList(dir, projectPath, option.ios.plist || {})
      } else if (option.ios) {
        const iosVersion = (option.ios && option.ios.version) || version
        const buildPatch = podfile.makeBuildPatch(iosPackageName, iosVersion)
        // Build Podfile config.
        podfile.applyPatch(path.join(dir, project.name, 'Podfile'), buildPatch)
        this.emit(LOGLEVEL.WARN, `${pluginName} has installed success in iOS project.`)
        this.emit(LOGLEVEL.INFO, `if you want to update it, please use \`weex plugin update\` command.`)
        // Update plugin.json in the project.
        this.pluginConfigs = utils.updatePluginConfigs(this.pluginConfigs, iosPackageName, option, 'ios')
        await utils.writePluginFile(this.config.rootPath, this.pluginConfigPath, this.pluginConfigs)
      }
    }
    if (utils.isAndroidProject(dir)) {
      const androidPackageName = option.android && option.android.name ? option.android.name : pluginName
      if (option.android) {
        this.androidPluginConfigs = utils.updateAndroidPluginConfigs(
          this.androidPluginConfigs,
          androidPackageName,
          option.android,
        )
        await utils.writeAndroidPluginFile(
          this.config.androidPath,
          this.androidPluginConfigPath,
          this.androidPluginConfigs,
        )
        // Update plugin.json in the project.
        this.pluginConfigs = utils.updatePluginConfigs(this.pluginConfigs, androidPackageName, option, 'android')
        await utils.writePluginFile(this.config.rootPath, this.pluginConfigPath, this.pluginConfigs)
        this.emit(LOGLEVEL.WARN, `${pluginName} has installed success in Android project.`)
        this.emit(LOGLEVEL.INFO, `if you want to update it, please use \`weex plugin update\` command.`)
      }
    }
  }

  async installNewPlugin(dir, pluginName, version) {
    let result: any = await utils.isNewVersionPlugin(pluginName, version)
    if (result.error) {
      this.emit(LOGLEVEL.ERROR, result.error)
      return
    } else if (result) {
      await this.handleInstall(dir, pluginName, version, result)
      if (this.shouldInstallPackage) {
        await this.installInPackage(dir, pluginName, version, result)
      }
    } else {
      this.emit(LOGLEVEL.WARN, `This package of weex is not support anymore! Please choose other package.`)
    }
  }

  async installForWeb(plugins) {
    if (!Array.isArray(plugins) || plugins.length <= 0) {
      return
    }
    const packageJsonFile = path.join(this.config.root, 'package.json')
    let packageJson = JSON.parse(fse.readFileSync(packageJsonFile))

    plugins.forEach(plugin => {
      packageJson['dependencies'][plugin.name] = plugin.version
    })

    packageJson = utils.sortDependencies(packageJson)

    fse.writeJson(packageJsonFile, packageJson, { spaces: '\t' })

    this.emit(LOGLEVEL.LOG, `Downloading plugins...`)

    await utils.installNpmPackage()
    this.emit(LOGLEVEL.LOG, `Building plugins...`)
    try {
      await utils.buildJS('build:plugin', true)
      this.emit(LOGLEVEL.SUCCESS, `Building plugins successful.`)
    } catch (error) {
      this.emit(LOGLEVEL.ERROR, error)
    }
  }

  async installForIOS(plugins) {
    if (!Array.isArray(plugins) || plugins.length <= 0) {
      return
    }
    plugins.forEach(plugin => {
      const buildPatch = podfile.makeBuildPatch(plugin.name, plugin.version)
      // Build Podfile config.
      podfile.applyPatch(path.join(this.config.iosPath, 'Podfile'), buildPatch)
      this.emit(LOGLEVEL.SUCCESS, `${plugin.name} has installed success in iOS project`)
    })
  }

  async installForAndroid(plugins) {
    if (!Array.isArray(plugins) || plugins.length <= 0) {
      return
    }
    plugins.forEach(plugin => {
      // write .wx_config.json on `platform/android`
      this.androidPluginConfigs = utils.updateAndroidPluginConfigs(this.androidPluginConfigs, plugin.name, plugin)
      this.emit(LOGLEVEL.SUCCESS, `${plugin.name} has installed success in Android project`)
    })
    await utils.writeAndroidPluginFile(this.config.androidPath, this.androidPluginConfigPath, this.androidPluginConfigs)
  }

  async install(pluginName) {
    let version
    if (/@/gi.test(pluginName)) {
      const temp = pluginName.split('@')
      pluginName = temp[0]
      version = temp[1]
    }
    const dir = process.cwd()
    // get the lastest version
    if (!version) {
      version = await npmHelper.getLastestVersion(pluginName)
      await this.installNewPlugin(dir, pluginName, version)
    } else {
      await this.installNewPlugin(dir, pluginName, version)
    }
  }

  async installForNewPlatform(platforms) {
    const pluginsList = JSON.parse(fse.readFileSync(path.join(this.config.rootPath, this.config.filename)))
    if (platforms && !Array.isArray(platforms)) {
      platforms = [platforms]
    }
    platforms.forEach(async platform => {
      switch (platform) {
        case 'web':
          await this.installForWeb(pluginsList[platform])
          break
        case 'ios':
          await this.installForIOS(pluginsList[platform])
          break
        case 'android':
          await this.installForAndroid(pluginsList[platform])
          break
        default:
          break
      }
    })
  }

  async uninstallInPackage(dir, pluginName) {
    const packageJsonPath = path.join(dir, 'package.json')
    // Update package.json
    if (fse.existsSync(packageJsonPath)) {
      const packageJson = require(packageJsonPath)
      if (packageJson.dependencies[pluginName]) {
        delete packageJson.dependencies[pluginName]
      }
      fse.writeJson(packageJsonPath, packageJson, { spaces: '\t' })
    }
    this.emit(LOGLEVEL.INFO, `Update plugins.json...`)
    // Update plugin.json in the project.
    this.pluginConfigs = utils.updatePluginConfigs(this.pluginConfigs, pluginName, {}, 'web')
    await utils.writePluginFile(this.config.rootPath, this.pluginConfigPath, this.pluginConfigs)

    this.emit(LOGLEVEL.INFO, `Building plugins...`)
    await utils.buildJS('build:plugin', true)
    this.emit(LOGLEVEL.SUCCESS, `Building plugins successful.`)
  }

  async handleUninstall(dir, pluginName, version, option) {
    if (option.web) {
      // should install npm package into project or not.
      this.shouldUninstallPackage = true
    }

    // check out the type of current project
    if (utils.isIOSProject(dir)) {
      const project: any = utils.isIOSProject(dir)
      if (!fse.existsSync(path.join(dir, project.name, 'Podfile'))) {
        this.emit(LOGLEVEL.ERROR, "can't find Podfile file")
        return
      }
      const iosPackageName = option.ios && option.ios.name ? option.ios.name : pluginName
      const iosVersion = (option.ios && option.ios.version) || version
      const buildPatch = podfile.makeBuildPatch(iosPackageName, iosVersion)
      // Remove Podfile config.
      podfile.revokePatch(path.join(dir, project.name, 'Podfile'), buildPatch)
      this.emit(LOGLEVEL.INFO, `${pluginName} has removed from iOS project`)
      // Update plugin.json in the project.
      this.pluginConfigs = utils.updatePluginConfigs(this.pluginConfigs, iosPackageName, '', 'ios')
      await utils.writePluginFile(this.config.rootPath, this.pluginConfigPath, this.pluginConfigs)
    }

    if (utils.isAndroidProject(dir)) {
      const androidPackageName = option.android && option.android.name ? option.android.name : pluginName

      this.androidPluginConfigs = utils.updateAndroidPluginConfigs(this.androidPluginConfigs, androidPackageName)
      await utils.writeAndroidPluginFile(
        this.config.androidPath,
        this.androidPluginConfigPath,
        this.androidPluginConfigs,
      )
      // const androidVersion = option.android && option.android.version || version
      // const buildPatch = gradle.makeBuildPatch(androidPackageName, androidVersion, option.android.groupId || '')
      // Remove gradle config.
      // gradle.revokePatch(path.join(dir, 'build.gradle'), buildPatch)
      this.emit(LOGLEVEL.INFO, `${pluginName} has removed from Android project`)
      // Update plugin.json in the project.
      this.pluginConfigs = utils.updatePluginConfigs(this.pluginConfigs, androidPackageName, '', 'android')
      await utils.writePluginFile(this.config.rootPath, this.pluginConfigPath, this.pluginConfigs)
    }

    if (fse.existsSync(path.join(dir, 'package.json'))) {
      await this.uninstallInPackage(dir, pluginName)
    } else {
      this.emit(
        LOGLEVEL.WARN,
        `The project may not be a weex project, please use \`${colors.white.bold('weex create [projectname]')}\``,
      )
    }
  }

  async uninstallNewPlugin(dir, pluginName, version) {
    let result = await utils.isNewVersionPlugin(pluginName, version)
    if (result) {
      await this.handleUninstall(dir, pluginName, version, result)
      if (this.shouldUninstallPackage) {
        await this.uninstallInPackage(dir, pluginName)
      }
    } else {
      this.emit(LOGLEVEL.ERROR, `This package of weex is not support anymore! Please choose other package.`)
    }
  }

  async uninstall(pluginName) {
    let version
    if (/@/gi.test(pluginName)) {
      const temp = pluginName.split('@')
      pluginName = temp[0]
      version = temp[1]
    }

    const dir = process.cwd()

    // get the lastest version
    if (!version) {
      version = await npmHelper.getLastestVersion(pluginName)
      await this.uninstallNewPlugin(dir, pluginName, version)
    } else {
      await this.uninstallNewPlugin(dir, pluginName, version)
    }
  }
}
