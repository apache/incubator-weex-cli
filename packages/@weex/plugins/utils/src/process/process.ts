/**
 * Help manage process
 */
const childProcess = require('child_process')

export function runAndGetOutput(cmdString: string, options = {}) {
  try {
    return childProcess.execSync(cmdString, Object.assign(
      { encoding: 'utf8' },
      options
    )).toString()
  } catch (e) {
    return ''
  }
}

export function createCmdString(cmdName: string, params: object) {
  let cmdString = `${cmdName} `

  const keys = Object.keys(params)

  keys.forEach(key => {
    cmdString = `${cmdString} -${key} ${params[key]}`
  })

  return cmdString
}

export function exec(cmdString: string, options?: {
  onCloseCallback?: Function,
  onOutCallback?: Function,
  onErrorCallback?: Function
}, execOptions?): Promise<string> {
  const { onOutCallback, onErrorCallback, onCloseCallback } = options
  return new Promise((resolve, reject) => {
    try {
      const child = childProcess.exec(
        cmdString,
        Object.assign({
          encoding: 'utf8',
          maxBuffer: 102400 * 1024,
          wraning: false
        }, execOptions),
        (error) => {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        }
      )
      if (onOutCallback) {
        child.stdout.on('data', data => {
          const buf = Buffer.from(data)
          const bufStr = buf.toString().trim()
          onOutCallback(bufStr)
        })
      }
      if (onErrorCallback) {
        child.stderr.on('data', data => {
          const bufStr = Buffer.from(data).toString()
          onErrorCallback(bufStr)
        })
      }
      if (onCloseCallback) {
        child.on('close', (code, signal) => {
          console.log('close')
          onCloseCallback(code, signal)
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}
