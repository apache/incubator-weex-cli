import { runAndGetOutput } from '../process/process'
import { IOS_XCODE_NOT_INSTALLED } from '../error/error-list'

export default class IosEnv {
  isInstalledXcode(isThrowError: boolean = true) {
    const result = runAndGetOutput(`/usr/bin/xcode-select --print-path`)

    if (result) {
      return !!result
    }

    if (isThrowError) {
      throw IOS_XCODE_NOT_INSTALLED
    }
    return false
  }

  getXcodeVersion():string | null {
    const result = runAndGetOutput(`xcodebuild -version`)
    const lines = result.split('\n')
    let version = null

    lines.some(line => {
      const match = line.match(/^Xcode\s+(\d.\d.\d)/)
      if (match && match[1]) {
        version = match[1]
        return true
      }
    })

    return version
  }

  // TODO sudo xcodebuild -license
}