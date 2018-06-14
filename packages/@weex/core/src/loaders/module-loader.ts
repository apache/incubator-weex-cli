import { fs } from '../toolbox/fs-tools'
import { strings } from '../toolbox/string-tools'

// try loading this module
export function loadModule(path) {
  if (strings.isBlank(path)) {
    throw new Error('path is required')
  }
  if (fs.isNotFile(path)) {
    throw new Error(`${path} is not a file`)
  }

  require.resolve(path)
  return require(path)
}
