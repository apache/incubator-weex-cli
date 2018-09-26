import { spawnSync } from 'child_process'
import { xcodeProjectInterpreter } from './xcodeproj'

export const XcodeRequiredVersionMajor = 9
export const XcodeRequiredVersionMinor = 0

export function xcodeSelectPath(): string {
  try {
    return spawnSync('/usr/bin/xcode-select', ['--print-path']).stdout.trim()
  } catch (e) {
    return ''
  }
}

export function isXcodeInstalled() {
  return !!xcodeSelectPath()
}

export class Xcode {
  public xcodeSelectPath: string
  constructor() {
    this.getXcodeSelectPath()
  }

  public getXcodeSelectPath() {
    try {
      this.xcodeSelectPath = spawnSync('/usr/bin/xcode-select', ['--print-path'])
        .stdout.toString()
        .trim()
    } catch (e) {
      throw e
    }
  }

  get isInstalled() {
    if (!this.xcodeSelectPath) {
      return false
    }
    return true
  }

  get versionText() {
    return xcodeProjectInterpreter.versionText
  }

  get majorVersion() {
    return xcodeProjectInterpreter.majorVersion
  }

  get minorVersion() {
    return xcodeProjectInterpreter.minorVersion
  }

  get isVersionSatisfactory(): boolean {
    if (!xcodeProjectInterpreter.isInstalled) {
      return false
    } else if (this.majorVersion > XcodeRequiredVersionMajor) {
      return true
    } else if (this.majorVersion === XcodeRequiredVersionMajor) {
      return this.minorVersion >= XcodeRequiredVersionMinor
    }
    return false
  }

  get isInstalledAndMeetsVersionCheck(): boolean {
    return this.isInstalled && this.isVersionSatisfactory
  }

  // Has the EULA been signed?
  get eulaSigned(): boolean {
    try {
      const result = spawnSync('/usr/bin/xcrun', ['clang', '-v'])
      if (result.stdout && result.stdout.includes('license')) {
        return false
      } else if (result.stderr && result.stderr.includes('license')) {
        return false
      } else {
        return true
      }
    } catch (e) {
      console.error(e)
      return false
    }
  }

  /**
   * if additional components need to be installed in
   */
  get isSimctlInstalled(): boolean {
    try {
      const result = spawnSync('/usr/bin/xcrun', ['simctl', 'list'])
      return !result.stderr.toString().trim() || result.stderr.toString().trim() === ''
    } catch (e) {
      console.error(e)
      return false
    }
  }
}

export const xcode = new Xcode()

export class IMobileDevice {
  get isInstalled(): boolean {
    try {
      const result = spawnSync('idevice_id', ['-h'])
      if (result.status === 0) {
        return true
      }
    } catch (e) {
      return false
    }
    return false
  }

  get isWorking(): boolean {
    if (!this.isInstalled) {
      return false
    }

    try {
      const result = spawnSync('idevice_id', ['-l'])
      if (result.status === 0 || !result.stdout.toString().length) {
        return true
      }
    } catch (e) {
      return false
    }
    try {
      return spawnSync('idevicename').status === 0
    } catch (e) {
      return false
    }
  }
}

export const iMobileDevice = new IMobileDevice()
