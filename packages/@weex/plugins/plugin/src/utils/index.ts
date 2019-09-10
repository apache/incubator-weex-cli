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
import * as path from 'path'
import * as fse from 'fs-extra'
import * as childProcess from 'child_process'
import npmHelper from './npm-helper'
import * as glob from 'glob'

const utils = {
  copyAndReplace(src, dest, replacements) {
    if (fse.lstatSync(src).isDirectory()) {
      if (!fse.existsSync(dest)) {
        fse.mkdirSync(dest)
      }
    } else {
      let content = fse.readFileSync(src, 'utf8')
      Object.keys(replacements).forEach(regex => {
        content = content.replace(new RegExp(regex, 'gm'), replacements[regex])
      })
      fse.writeFileSync(dest, content)
    }
  },

  findGradleProject(dir) {
    if (!fse.existsSync(dir)) {
      return false
    }
    const files = glob.sync('**/build.gradle', { root: dir })
    if (files.length > 0) {
      return files
    }
    return false
  },

  findXcodeProject(dir) {
    if (!fse.existsSync(dir)) {
      return false
    }
    const files = glob.sync('**/*.+(xcworkspace|xcodeproj)', { root: dir })
    if (files.length > 0) {
      let name = ''
      let isWorkspace = false
      files.forEach(file => {
        let ext = path.extname(file)
        if (ext === '.xcworkspace') {
          isWorkspace = true
        }
        name = file
      })
      return {
        isWorkspace: isWorkspace,
        name: path.relative(dir, name.replace(path.basename(name), '')),
      }
    } else {
      return false
    }
  },

  parseIOSDevicesList(text) {
    const devices = []
    const REG_DEVICE = /(.*?) \((.*?)\) \[(.*?)]/

    const lines = text.split('\n')
    for (const line of lines) {
      if (line.indexOf('Watch') >= 0 || line.indexOf('TV') >= 0 || line.indexOf('iPad') >= 0) {
        continue
      }
      const device = line.match(REG_DEVICE)
      if (device !== null) {
        const name = device[1]
        const version = device[2]
        const udid = device[3]
        const isSimulator = line.indexOf('Simulator') >= 0 || udid.indexOf('-') >= 0
        devices.push({ name, version, udid, isSimulator })
      }
    }

    return devices
  },

  parseDevicesResult(result) {
    if (!result) {
      return []
    }

    const devices = []
    const lines = result.trim().split(/\r?\n/)

    for (let i = 0; i < lines.length; i++) {
      const words = lines[i].split(/[ ,\t]+/).filter(w => w !== '')

      if (words[1] === 'device') {
        devices.push(words[0])
      }
    }
    return devices
  },

  exec(command: string, quiet: boolean, options?: any) {
    return new Promise((resolve, reject) => {
      try {
        const child = childProcess.exec(
          command,
          Object.assign({ encoding: 'utf8', wraning: false, maxBuffer: Infinity }, options),
          (error, stdout, stderr) => {
            if (error) {
              console.warn(
                'Command run error, please check if there has the same issue here: https://github.com/weexteam/weex-toolkit/issues/337',
              )
              reject(error)
            } else {
              resolve()
            }
          },
        )
        if (!quiet) {
          child.stdout.pipe(process.stdout)
        }
        child.stderr.pipe(process.stderr)
      } catch (e) {
        console.error('execute command failed :', command)
        reject(e)
      }
    })
  },

  buildJS(cmd = 'build', quiet?: boolean) {
    return utils.exec('npm run ' + cmd, quiet)
  },

  getIOSProjectInfo() {
    const projectInfoText = childProcess.execSync('xcodebuild  -list', { encoding: 'utf8' })
    const splits = projectInfoText.split(/Targets:|Build Configurations:|Schemes:/)
    const projectInfo = {
      name: splits[0].match(/Information about project "([^"]+?)"/)[1],
      targets: splits[1]
        ? splits[1]
            .split('\n')
            .filter(e => !!e.trim())
            .map(e => e.trim())
        : [],
      configurations: splits[2]
        ? splits[2]
            .split('\n')
            .filter((e, i) => !!e.trim() && i < 3)
            .map(e => e.trim())
        : [],
      schemes: splits[3]
        ? splits[3]
            .split('\n')
            .filter(e => !!e.trim())
            .map(e => e.trim())
        : [],
    }
    return { project: projectInfo }
  },

  dashToCamel(str) {
    return str.replace(/(-[a-z])/g, function($1) {
      return $1.toUpperCase().replace('-', '')
    })
  },

  isIOSProject(dir) {
    const result = this.findXcodeProject(dir)
    return result
  },

  isAndroidProject(dir) {
    return this.findGradleProject(dir)
  },

  async isNewVersionPlugin(pluginName, version) {
    return new Promise(async (resolve, reject) => {
      let trynum = 0
      const load = async npmName => {
        let info: any = await npmHelper.getNpmPackageInfo(pluginName, version)
        let prefix
        if (info.error && trynum === 0) {
          trynum++
          if (npmName === 'weex-gcanvas') {
            prefix = 'weex-plugin--'
          } else {
            prefix = 'weex-plugin-'
          }
          await load(prefix + npmName)
        } else if (info.error && trynum !== 0) {
          reject(info.error)
        } else {
          if (info.android || info.ios || info.web) {
            const supports = []
            if (info.android) {
              supports.push('Android')
            }
            if (info.ios) {
              supports.push('iOS')
            }
            if (info.web) {
              supports.push('Web')
            }
            resolve({
              ios: info.ios,
              android: info.android,
              web: info.web,
              version: info.version,
              name: info.name,
              weexpack: info.weexpack,
              pluginDependencies: info.pluginDependencies,
            })
          } else {
            reject('Not support')
          }
        }
      }
      await load(pluginName)
    })
  },

  async writePluginFile(root, path, config) {
    await fse.ensureDir(root)
    await fse.ensureFile(path)
    await fse.writeJson(path, config, { spaces: '\t' })
  },

  updatePluginConfigs(configs, name, option, platform) {
    const plugins = Object.assign({}, configs)
    const len = plugins[platform] && plugins[platform].length
    for (let i = len - 1; i >= 0; i--) {
      if (name && plugins[platform][i].name === name) {
        if (option[platform]) {
          plugins[platform].splice(i, 1, option[platform])
        } else {
          plugins[platform].splice(i, 1)
        }
        return plugins
      }
    }
    if (option[platform]) {
      plugins[platform].push(option[platform])
    }
    return plugins
  },

  async writeAndroidPluginFile(root, path, config) {
    await fse.ensureDir(root)
    await fse.ensureFile(path)
    await fse.writeJson(path, config, { spaces: '\t' })
  },

  updateAndroidPluginConfigs(configs, name, option?: any) {
    const plugins = configs.slice(0)
    const len = plugins && plugins.length
    if (option && !option['dependency']) {
      option['dependency'] = `${option.groupId}:${option.name}:${option.version}`
    }
    for (let i = len - 1; i >= 0; i--) {
      const plugin = plugins[i]
      if (typeof plugin['dependency'] === 'undefined') {
        plugin['dependency'] = `${plugin.groupId}:${plugin.name}:${plugin.version}`
      }
      if (name && plugin.name === name) {
        if (option) {
          plugins.splice(i, 1, option)
        } else {
          plugins.splice(i, 1)
        }
        return plugins
      }
    }
    if (option) {
      plugins.push(option)
    }
    return plugins
  },

  installNpmPackage() {
    return utils.exec('npm install', false)
  },

  isRootDir(dir) {
    if (fse.existsSync(path.join(dir, 'platforms'))) {
      if (fse.existsSync(path.join(dir, 'web'))) {
        // For sure is.
        if (fse.existsSync(path.join(dir, 'config.xml'))) {
          return 2
        } else {
          return 1
        }
      }
    }
    return 0
  },

  listPlatforms(projectDir) {
    const platforms = require('../platform/platforms')
    const platformsDir = path.join(projectDir, 'platforms')
    if (!fse.existsSync(platformsDir)) {
      return []
    }
    const subdirs = fse.readdirSync(platformsDir)
    return subdirs.filter(function(p) {
      return Object.keys(platforms).indexOf(p) > -1
    })
  },

  fill(name, length) {
    let space = length - name.length
    if (space > 0) {
      while (space--) {
        name += ' '
      }
    }
    return name
  },

  sortDependencies(json): any {
    // Based on https://github.com/yarnpkg/yarn/blob/v1.3.2/src/config.js#L79-L85
    const sortedObject = {}
    Object.keys(json)
      .sort()
      .forEach(item => {
        sortedObject[item] = json[item]
      })
    return sortedObject
  },
}

export default utils
