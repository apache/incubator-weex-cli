import { runAndGetOutput } from '../process/process'
import { IOS_XCODE_NOT_INSTALLED } from '../error/errorList'

export default class IosEnv {
  isInstalledXcode(isThrowError: boolean = true) {
    const reulst = runAndGetOutput(`/usr/bin/xcode-select --print-path`)

    if (reulst) {
      return !!reulst
    }

    if (isThrowError) {
      throw IOS_XCODE_NOT_INSTALLED
    }
    return false
  }

  getXcodeVersion():string | null {
    const reulst = runAndGetOutput(`xcodebuild -version`)
    const lines = reulst.split('\n')
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
}