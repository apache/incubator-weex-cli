const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

import Runner from '../base/runner'
import { IosRunnerConfig } from '../common/runner'
import { createCmdString } from '../utils/process'

export default class IosRunner extends Runner {

  protected config: IosRunnerConfig

  constructor(options: IosRunnerConfig) {
    super(options)
  }

  buildNative() {
    if (this.config.isRealDevice) {
      return this.buildForRealDevice()
    } else {
      return this.buildForSimulator()
    }
  }

  private buildForSimulator(): string {
    const { nativePath } = this.config
    const projectInfo = this.getIOSProjectInfo(nativePath)
    const cmdParams = {
      scheme: projectInfo.scheme,
      configuration: 'Debug',
      sdk: 'iphonesimulator',
      derivedDataPath: 'build clean build'
    }

    // Default `workspace`
    // If not projectName try use scheme
    if (!projectInfo.isWorkspace) {
      Object.assign(cmdParams, {
        project: projectInfo.name || projectInfo.scheme,
      })
    } else {
      Object.assign(cmdParams, {
        workspace: projectInfo.name || projectInfo.scheme,
      })
    }
    execSync(createCmdString('xcodebuild', cmdParams), { cwd: nativePath}).toString()
    return path.join(nativePath, `build/Build/Products/Debug-iphonesimulator/${projectInfo.name || projectInfo.scheme}.app`)
  }

  private buildForRealDevice(): string {
    // TODO
    console.warn('Not support!')
    return ''
  }

  private getIOSProjectInfo(
    dir: string,
  ): {
    scheme: string
    targets: Array<string>
    schemes: Array<string>
    isWorkspace: boolean
    name: string
  } {
    let projectInfoText
    try {
      projectInfoText = execSync('xcodebuild -list', { cwd: dir })
    } catch (e) {
      throw new Error('Not find xcode project!')
    }
    const splits = projectInfoText.toString().split(/Targets:|Build Configurations:|Schemes:/)
    const projectInfo: any = {}
    projectInfo.scheme = splits[0].match(/Information about project "([^"]+?)"/)[1]
    projectInfo.targets = splits[1]
      ? splits[1]
          .split('\n')
          .filter(e => !!e.trim())
          .map(e => e.trim())
      : []
    projectInfo.configurations = splits[2]
      ? splits[2]
          .split('\n')
          .filter((e, i) => !!e.trim() && i < 3)
          .map(e => e.trim())
      : []
    projectInfo.schemes = splits[3]
      ? splits[3]
          .split('\n')
          .filter(e => !!e.trim())
          .map(e => e.trim())
      : []

    return Object.assign(projectInfo, this.findXcodeProject(dir))
  }

  private findXcodeProject(dir: string) {
    if (!fs.existsSync(dir)) {
      return {}
    }
    const files = fs.readdirSync(dir)
    const sortedFiles = files.sort()
    for (let i = sortedFiles.length - 1; i >= 0; i--) {
      const fileName = files[i]
      const ext = path.extname(fileName)

      if (ext === '.xcworkspace') {
        return {
          name: fileName,
          isWorkspace: true,
        }
      }
      if (ext === '.xcodeproj') {
        return {
          name: fileName,
          isWorkspace: false,
        }
      }
    }

    return {}
  }
}
