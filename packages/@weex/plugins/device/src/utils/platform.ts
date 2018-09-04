const os = require('os')

const platform = os.platform()

/**
 * For check platform
 */
export default {
  isWindows: platform === 'win32',
  isMacOS: platform === 'darwin',
  isLinux: platform === 'linux',

  homedir: os.homedir(),
}
