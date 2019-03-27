import { fs } from './fs-tools'
import * as path from 'path'
import * as importedColors from 'colors/safe'
import { InstallerOption } from './installer-types'
import * as childProcess from 'child_process'
import * as npmii from 'npminstall'
import * as co from 'co'
import * as debug from 'debug'
const DEBUG = debug('weex:core:toolbox')
const execSync = childProcess.execSync

// hack typescript
const colors: any = importedColors

const checkDependencies = async dir => {
  let t = Date.now()
  let pkgData: any
  try {
    pkgData = await fs.read(path.join(dir, 'package.json'), 'json')
  } catch (e) {
    DEBUG('read package fail: %d', e && e.stack)
  }

  const deps = Object.keys(pkgData.dependencies || {})
  if (deps.length > 0) {
    deps.map(dep => {
      return new Promise(async (resolve, reject) => {
        try {
          let p = path.join(dir, 'node_modules', dep)
          await fs.existsAsync(p)
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    })
  }
  DEBUG('check using: %ds', (Date.now() - t) / 1000)
}

const installer = async opts => {
  const TIMEOUT = 10 * 60 * 1000
  const utils = require('npminstall/lib/utils')
  const env: any = {}
  env['npm_config_registry'] = opts.registry
  env['npm_node_execpath'] = env.NODE = process.env.NODE || process.execPath
  env['npm_execpath'] = require.main.filename

  // set node-gyp env for windows.
  if (process.platform === 'win32') {
    let python = getPython()
    let msvsVersion = getMsvsVersion()
    if (python) {
      env['npm_config_python'] = python
    }
    if (msvsVersion) {
      env['npm_config_msvs_version'] = msvsVersion
    }
  }

  // set mirror env.
  DEBUG(`set mirror env`)
  let binaryMirros
  await co(function*() {
    try {
      binaryMirros = yield utils.getBinaryMirrors(opts.registry)
    } catch (e) {
      debug('getBinaryMirrors Error:', e)
    }
  })

  for (let key in binaryMirros.ENVS) {
    env[key] = binaryMirros.ENVS[key]
  }

  if (opts.ENVS) {
    for (let key in opts.ENVS) {
      env[key] = opts.ENVS[key]
    }
  }

  DEBUG(`npminstall env: ${JSON.stringify(env)}`)

  // no proxy
  process.env.NO_PROXY = '*'
  // using a pure npm installer
  return co(function*() {
    try {
      yield npmii({
        production: true,
        env: env,
        registry: opts.registry,
        binaryMirrors: binaryMirros,
        timeout: opts.timeout || TIMEOUT,
        strictSSL: getStrictSSL(),
        ignoreScripts: false,
        root: opts.root,
        pkgs: opts.pkgs,
      })
    } catch (e) {
      e.type = '_install_core'
      throw e
    }
  })
}

function getStrictSSL() {
  try {
    const strictSSL = execSync('npm config get strict-ssl')
      .toString()
      .trim()
    return strictSSL !== 'false'
  } catch (err) {
    console.error('exec npm config get strict-ssl ERROR: ' + err.message)
    return true
  }
}

function getPython() {
  try {
    return execSync('npm config get python')
      .toString()
      .trim()
  } catch (err) {
    console.error('exec npm config get python ERROR:' + err.message)
  }
  return ''
}

function getMsvsVersion() {
  try {
    return execSync('npm config get msvs_version')
      .toString()
      .trim()
  } catch (err) {
    console.error('exec npm config get msvs_version ERROR:' + err.message)
  }
  return ''
}

const _install = async (name, version, opts) => {
  let t = Date.now()
  await installer({
    registry: opts.registry || 'https://registry.npmjs.org/',
    root: opts.root,
    pkgs: [{ name: name, version: version }],
  })
  DEBUG('install using: %ds', (Date.now() - t) / 1000)
}

const install = async (name: string, version: string, opts: InstallerOption) => {
  const start = Date.now()
  const pkgFile = path.join(opts.root, 'node_modules', name, 'package.json')
  // check lock
  const lockFile = path.join(opts.root, '.lock')
  const exists = fs.exists(lockFile)
  DEBUG(`start install package ${name}@${version}`)
  if (exists && !opts.force) {
    let err: any = new Error('module is locked')
    err.type = '_lock'
    throw err
  }

  let cleared = false
  let succeed = false

  const clear = async () => {
    if (!cleared) {
      DEBUG('clear, lockfile: %s; succeed: %s; pkgfile: %s', lockFile, succeed, pkgFile)
      try {
        // unlock
        fs.remove(lockFile)
        if (!succeed) {
          // if install fail, rollback
          fs.remove(pkgFile)
        }
      } catch (e) {
        DEBUG('clear error', e.message)
      }
      cleared = true
    } else {
      DEBUG('already cleared')
    }
  }

  // lock
  fs.write(lockFile, {})
  require('on-exit')(clear)
  DEBUG(`lock installing progress...`)

  try {
    await _install(name, version, opts)
  } catch (e) {
    await clear()
    e.type = '_install'
    throw e
  }

  console.log(colors.yellow('\nStart checking package, please wait ...'))
  try {
    await checkDependencies(path.join(opts.root, 'node_modules', name))
  } catch (e) {
    await clear()
    e.type = '_check'
    throw e
  }

  let packageJson: any
  // read pkg again.
  try {
    packageJson = await fs.read(path.join(opts.root, 'node_modules', name, 'package.json'), 'json')
  } catch (e) {
    DEBUG('read package json error: %d', e && e.stack)
  }
  if (!packageJson) {
    packageJson = {}
  }
  DEBUG('new package json: %o', packageJson)

  // mark install to success
  succeed = true
  await clear()

  console.log(colors.yellow('compelied, cost ' + (Date.now() - start) / 1000 + 's'))
  DEBUG('install core done')

  return {
    root: path.join(opts.root, 'node_modules', name),
    package: packageJson,
  }
}

export { install, InstallerOption }
