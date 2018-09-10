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

/**
 * Convert a object to cmd string for `exec` use
 * @param cmdName
 * @param params
 */
export function createCmdString(cmdName: string, params: object) {
  let cmdString = `${cmdName} `

  const keys = Object.keys(params)

  keys.forEach(key => {
    cmdString = `${cmdString} ${key} ${params[key]}`
  })

  return cmdString
}

export interface ExecOptions {
  onOutCallback?: Function
  onErrorCallback?: Function
  onCloseCallback?: Function
  handleChildProcess?: Function
}

export function exec(cmdString: string, options?: ExecOptions, nativeExecOptions?): Promise<string> {
  const {
    onOutCallback,
    onErrorCallback,
    onCloseCallback,
    handleChildProcess
  } = (options || {}) as ExecOptions
  return new Promise((resolve, reject) => {
    try {
      const child = childProcess.exec(
        cmdString,
        Object.assign({
          encoding: 'utf8',
          maxBuffer: 102400 * 1024,
          wraning: false
        }, nativeExecOptions),
        (error) => {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        }
      )
      if (handleChildProcess) {
        handleChildProcess(child)
      }
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
          onCloseCallback(code, signal)
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}
