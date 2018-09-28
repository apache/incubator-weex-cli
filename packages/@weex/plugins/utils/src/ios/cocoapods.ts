import { runAsync } from '../process/process'
import * as path from 'path'
import * as fs from 'fs'
import { versionParse, VersionOption, compareVersion } from '../base/version'
import { homedir } from '../platform/platform'

export const noCocoaPodsConsequence: string = `CocoaPods is used to retrieve the iOS platform side's plugin code.\nWithout resolving iOS dependencies with CocoaPods, plugins will not work on iOS.`

export const cocoaPodsInstallInstructions: string = `
  brew install cocoapods
  pod setup`

export const cocoaPodsUpgradeInstructions: string = `
  brew upgrade cocoapods
  pod setup`

export enum CocoaPodsStatus {
  // iOS plugins will not work, installation required.
  notInstalled,
  // iOS plugins will not work, upgrade required.
  belowMinimumVersion,
  // iOS plugins may not work in certain situations (Swift, static libraries),
  // upgrade recommended.
  belowRecommendedVersion,
  // Everything should be fine.
  recommended,
}

export class CocoaPods {
  public cocoaPodsMinimumVersion: string = '1.0.0'
  public cocoaPodsRecommendedVersion: string = '1.5.0'
  public cocoaPodsVersionText: string

  constructor() {
    runAsync('pod', ['--version'])
      .then((result: { status: number; stdout: string }) => {
        if (result.status === 0) {
          this.cocoaPodsVersionText = result.stdout.toString().trim()
        }
      })
      .catch(e => {
        console.error(e)
      })
  }

  get evaluateCocoaPodsInstallation() {
    if (!this.cocoaPodsVersionText) {
      return CocoaPodsStatus.notInstalled
    }
    try {
      const version: VersionOption = versionParse(this.cocoaPodsVersionText)
      if (!compareVersion(version, versionParse(this.cocoaPodsMinimumVersion))) {
        return CocoaPodsStatus.belowMinimumVersion
      } else if (!compareVersion(version, versionParse(this.cocoaPodsRecommendedVersion))) {
        return CocoaPodsStatus.belowRecommendedVersion
      } else {
        return CocoaPodsStatus.recommended
      }
    } catch (e) {
      return CocoaPodsStatus.notInstalled
    }
  }

  // where the costly pods' specs are cloned.
  get isCocoaPodsInitialized(): boolean {
    const cocoaPath = path.join(homedir, '.cocoapods', 'repos', 'master')
    if (fs.existsSync(cocoaPath)) {
      return fs.statSync(cocoaPath).isDirectory()
    }
    return false
  }
}
