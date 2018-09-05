const fs = require('fs')
const path = require('path')

import Runner from '../base/builder'
import { IosBuilderConfig } from '../common/builder'
import { createCmdString, exec, runAndGetOutput } from '../utils/process'
import { IOS_DERIVE_DATA_PATH } from '../common/const'
import { IOS_CODE_SIGNING_ERROR } from '../common/errorList'

export default class IosRunner extends Runner {

  protected config: IosBuilderConfig

  constructor(options: IosBuilderConfig) {
    super(options)
  }

  buildNative() {
    if (this.config.isRealDevice) {
      return this.buildForRealDevice()
    } else {
      return this.buildForSimulator()
    }
  }

  private async buildForSimulator() {
    const { projectPath } = this.config
    const projectInfo = this.getIOSProjectInfo(projectPath)
    const cmdParams = {
      scheme: projectInfo.scheme,
      configuration: 'Debug',
      sdk: 'iphonesimulator',
      derivedDataPath: IOS_DERIVE_DATA_PATH
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
    await exec(createCmdString('xcodebuild', cmdParams), {}, { cwd: projectPath })
    return path.join(projectPath, `${IOS_DERIVE_DATA_PATH}/Build/Products/Debug-iphonesimulator/${projectInfo.name || projectInfo.scheme}.app`)
  }

  private async buildForRealDevice() {
    const { projectPath } = this.config
    const projectInfo = this.getIOSProjectInfo(projectPath)
    const cmdParams = {
      scheme: projectInfo.scheme,
      configuration: 'Debug',
      derivedDataPath: IOS_DERIVE_DATA_PATH
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
    let isCodeSigningError = false
    await exec(createCmdString('xcodebuild', cmdParams), {
      onOutCallback(bufStr) {
        if (bufStr.indexOf(`Code Signing Error`) !== -1) {
          isCodeSigningError = true
        }
      }
    }, { cwd: projectPath})
    if (isCodeSigningError) {
      throw IOS_CODE_SIGNING_ERROR
    }
    return path.join(projectPath, `${IOS_DERIVE_DATA_PATH}/Build/Products/Debug-iphonesimulator/${projectInfo.name || projectInfo.scheme}.app`)
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
    const projectInfoText = runAndGetOutput('xcodebuild -list', { cwd: dir })
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
