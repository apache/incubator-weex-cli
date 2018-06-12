import * as execa from 'execa'
import * as path from 'path'

/**
 * open a file or uri using the default application for the file type.
 *
 * @return {ChildProcess} - the child process object.
 * @param {string} target - the file/uri to open.
 * @param {string} appName - (optional) the application to be used to open the
 *      file (for example, "chrome", "firefox")
 * @param {function(Error)} callback - called with null on success, or
 *      an error object that contains a property 'code' with the exit
 *      code of the process.
 */
async function open(target: string, appName?:string, callback?: any) {
  let opener

  if (typeof(appName) === 'function') {
    callback = appName
    appName = null
  }

  switch (process.platform) {
  case 'darwin':
    if (appName) {
      opener = 'open -a "' + escape(appName) + '"'
    } else {
      opener = 'open'
    }
    break
  case 'win32':
    // if the first parameter to start is quoted, it uses that as the title
    // so we pass a blank title so we can quote the file we are opening
    if (appName) {
      opener = 'start "" "' + escape(appName) + '"'
    } else {
      opener = 'start ""'
    }
    break
  default:
    if (appName) {
      opener = escape(appName)
    } else {
      // use Portlands xdg-open everywhere else
      opener = path.join(__dirname, '../vendor/xdg-open')
    }
    break
  }

  if (process.env.SUDO_USER) {
    opener = 'sudo -u ' + process.env.SUDO_USER + ' ' + opener
  }
  return execa(opener + ' "' + escape(target) + '"').then(callback)
}

function escape(s) {
  return s.replace(/"/g, '\\\"')
}

export { open }