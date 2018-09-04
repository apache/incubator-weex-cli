/**
 * Help manage process
 */
const childprocess = require('child_process')

export function runAndGetOutput(cmdString: string) {
  try {
    return childprocess.execSync(cmdString, { encoding: 'utf8' })
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
