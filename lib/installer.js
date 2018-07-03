'use strict';

const execSync = require('child_process').execSync;
const npmii = require('npminstall');
const co = require('co');

const TIMEOUT = 10 * 60 * 1000;


module.exports = async (opts) => {
  const utils = require('npminstall/lib/utils');

  const env = {};
  env['npm_config_registry'] = opts.registry;
  env['npm_node_execpath'] = env.NODE = process.env.NODE || process.execPath;
  env['npm_execpath'] = require.main.filename;

  // set node-gyp env for windows.
  if (process.platform == 'win32') {
    let python = getPython();
    let msvsVersion = getMsvsVersion();
    if (python) {
      env['npm_config_python'] = python;
    }
    if (msvsVersion) {
      env['npm_config_msvs_version'] = msvsVersion;
    }
  }

  // set mirror env.
  const binaryMirros = await utils.getBinaryMirrors(opts.registry);
  for (let key in binaryMirros.ENVS) {
    env[key] = binaryMirros.ENVS[key];
  }

  // no proxy
  process.env.NO_PROXY = '*';

  // using a pure npm installer
  return co(function * () {
    try {
      yield npmii({
        'production': true,
        'env': env,
        'registry': opts.registry,
        'binaryMirrors': binaryMirros,
        'timeout': opts.timeout || TIMEOUT,
        'strictSSL': getStrictSSL(),
        'ignoreScripts': false,
        'root': opts.root,
        'pkgs': opts.pkgs
      });
    }
    catch (e) {
      e.type = '_install_core'
      throw e;
    }
  })
};


function getStrictSSL() {
  try {
    var strictSSL = execSync('npm config get strict-ssl').toString().trim();
    return strictSSL !== 'false';
  } catch (err) {
    console.error('exec npm config get strict-ssl ERROR: ' + err.message);
    return true;
  }
}

function getPython() {
  try {
    return execSync('npm config get python').toString().trim();
  } catch (err) {
    console.error('exec npm config get python ERROR:' + err.message);
  }
  return '';
}

function getMsvsVersion() {
  try {
    return execSync('npm config get msvs_version').toString().trim();
  } catch (err) {
    console.error('exec npm config get msvs_version ERROR:' + err.message);
  }
  return '';
}
