const os = require('os')

const platform = os.platform()

/**
 * For check platform and provide some platform value
 */
export const isWindows = /^win/.test(platform)
export const isMacOS = /^darwin/.test(platform)
export const isLinux = /^linux/.test(platform)
export const homedir = os.homedir()
