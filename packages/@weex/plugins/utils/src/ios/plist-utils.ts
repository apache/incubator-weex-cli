import * as fs from 'fs'
import * as path from 'path'
import { spawnSync } from 'child_process'

export const kCFBundleShortVersionStringKey = 'CFBundleShortVersionString'

export function getValueFromFile(plistFilePath: string, key: string):string {
  const executable = '/usr/bin/defaults'
  if (!fs.existsSync(executable)) {
    return null
  }
  if (!fs.existsSync(plistFilePath)) {
    return null
  }
  const parsePlistPath = path.parse(plistFilePath)
  const normalizedPlistPath = path.join(parsePlistPath.dir, parsePlistPath.name)

  try {
    const results = spawnSync(executable, ['read', normalizedPlistPath, key])
    return results.stdout.toString().trim()
  }catch(e) {
    return null
  }
}