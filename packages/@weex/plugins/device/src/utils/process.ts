/**
 * Help manage process
 */
const childprocess = require('child_process')
const debug = require('debug')('device')

export default {
  runAndGetOutput(cmdString: string) {
    try {
      return childprocess.execSync(cmdString, { encoding: 'utf8' })
    } catch (e) {
      return ''
    }
  },

  exec(cmdString: string) {
    return new Promise((resolve, reject) => {
      childprocess.exec(cmdString, (error, stdout, stderr) => {
        if (error) {
          debug(`exec error: ${error}`)
          return reject(error)
        }
        resolve(stdout)
      })
    })
  },
}
