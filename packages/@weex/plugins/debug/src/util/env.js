'use strict'

const exec = require('child_process').exec

const PROGRAMS = {
  node: {
    getVersion: runVersionCommand.bind(null, 'node --version')
  },
  npm: {
    getVersion: runVersionCommand.bind(null, 'npm --version')
  },
  weex: {
    getVersion: runVersionCommand.bind(null, 'weex --version')
  }
}

function runVersionCommand (command, callback) {
  exec(command, function (execError, stdin, stderr) {
    const commandDescription = JSON.stringify(command)
    if (execError && execError.code === 127) {
      return callback(null, {
        notfound: true
      })
    }
    else if (execError || stderr) {
      const runError = new Error('Command failed: ' + commandDescription)
      if (stderr) {
        runError.stderr = stderr.trim()
      }
      if (execError) {
        runError.execError = execError
      }
      return callback(null, {
        error: runError
      })
    }
    else {
      const version = stdin.toString().split('\n')
      for (let i = version.length - 1; i >= 0; i--) {
        if (!version[i]) {
          version.splice(i, 1)
        }
        else {
          version[i] = version[i].trim()
        }
      }
      if (command.indexOf('weex') !== -1) {
        const weexVersion = {}
        let temp
        const version = stdin.toString().split('\n')
        for (let i = version.length - 1; i >= 0; i--) {
          if (!version[i]) {
            version.splice(i, 1)
          }
          else {
            temp = version[i].split(':')
            if (temp.length < 2) {
              weexVersion['weex'] = version[i].replace(/[\s|v]/g, '')
            }
            else {
              weexVersion[temp[0].replace(/[\s|-]/g, '')] = temp[1].replace(
                /[\s|v]/g,
                ''
              )
            }
          }
        }
        return callback({
          version: weexVersion
        })
      }
      else {
        return callback({
          version: stdin
            .toString()
            .split('\n')[0]
            .replace('v', '')
            .trim()
        })
      }
    }
  })
}

const getVersionOf = (name, callback) => {
  PROGRAMS[name].getVersion(callback)
}

module.exports = {
  getVersionOf
}
