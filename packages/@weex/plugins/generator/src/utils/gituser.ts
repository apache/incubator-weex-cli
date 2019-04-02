import * as child_process from 'child_process'
import * as DEBUG from 'debug'

const debug = DEBUG('weex-cli:generator')
const exec = child_process.execSync

export function gitUser(): string {
  let name
  let email

  try {
    name = exec('git config --get user.name')
    email = exec('git config --get user.email')
  } catch (e) {
    debug('Exec gituser error:', e)
  }

  name = name && JSON.stringify(name.toString().trim()).slice(1, -1)
  email = email && ' <' + email.toString().trim() + '>'
  return (name || '') + (email || '')
}

export default gitUser
