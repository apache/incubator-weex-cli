import { isMacOS } from '../platform/platform'
import { existsSync } from 'fs'
import { spawnSync } from 'child_process'

// Interpreter of Xcode projects.
export class XcodeProjectInterpreter {
  private executable: string = '/usr/bin/xcodebuild'
  public versionText: string
  public versionRegex = /Xcode ([0-9.]+)/
  public majorVersion: number
  public minorVersion: number

  constructor() {
    this.updateVersion()
  }

  public updateVersion() {
    if (!isMacOS || !existsSync(this.executable)) {
      return
    }
    try {
      const result = spawnSync(this.executable, ['-version'])
      this.versionText = result.stdout
        .toString()
        .trim()
        .replace('\n', ', ')
      const match = this.versionText.match(this.versionRegex)
      if (match === null) {
        return
      }
      const version = match[1]
      const components = version.split('.')
      this.majorVersion = Number(components[0])
      this.minorVersion = components.length === 1 ? 0 : Number(components[1])
    } catch (e) {
      console.error(e)
    }
  }

  get isInstalled() {
    if (this.majorVersion === undefined) {
      this.updateVersion()
    }
    return this.majorVersion !== undefined
  }
}

export const xcodeProjectInterpreter = new XcodeProjectInterpreter()
