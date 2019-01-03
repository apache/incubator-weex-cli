"use strict";
const debug = require('debug')('weex:cli');

const fse = require('fs-extra');
const path = require('path');
const colors = require('colors');
const onExist = require('on-exit');
const trash = require('./trash');
const installer = require('./installer');

const getNodeArgs = () => {
  const nodeVersion = process.version;
  const requiresHarmonyFlagRegex = /^v[45]\./;
  const nodeArgs = [];

  if (requiresHarmonyFlagRegex.test(nodeVersion)) {
    nodeArgs.push("--harmony");
  }

  return nodeArgs;
};

const outputJson = async (json, file) => {
  try {
    await fse.outputJson(file, json)
  } catch (err) {
    console.error(err)
  }
}

const readJson = async (file) => {
  const content = await fse.readJson(file, { throws: false })
  return content;
}

const install = async (name, version, opts) =>{
  const start = Date.now();

  const pkgFile = path.join(opts.root, 'node_modules', name, 'package.json');

  // check lock
  const lockFile = path.join(opts.root, '.lock');
  const exists = await fse.exists(lockFile);
  if (exists && !opts.force) {
    let err = new Error('module is locked');
    err.type = '_lock';
    throw err;
  }

  let cleared = false;
  let succeed = false;

  const clear = async () => {
    if (!cleared) {
      debug('clear, lockfile: %s; succeed: %s; pkgfile: %s', lockFile, succeed, pkgFile);
      try {
        // unlock
        fse.remove(lockFile);
        if (!succeed) {
          // if install fail, rollback
          fse.remove(pkgFile);
        }
      } catch(e) {
        debug('clear error', e.message);
      }
      cleared = true;
    } else {
      debug('already cleared');
    }
  }
	
  // lock
  await fse.ensureFile(lockFile);
  onExist(clear);

  try {
    await _install(name, version, opts);
  } catch(e) {
    clear();
    e.type = '_install';
    throw e;
  }

  console.log(colors.yellow('\nStart checking Core, please wait ...'));
  try {
    await checkDependencies(path.join(opts.root, 'node_modules', name));
  } catch(e) {
    clear();
    e.type = '_check';
    throw e;
  }

  // read pkg again.
  try {
    pkgFile = await readJson(path.join(opts.root, 'node_modules', name, 'package.json'));
  } catch(e) {}
  if (!pkgFile) {
    pkgFile = {};
  }
  debug('new package json: %o', pkgFile);

  // mark install to success
  succeed = true;
  clear();

  console.log(colors.yellow('compelied, cost ' + (Date.now() - start) / 1000 + 's'));
  debug('install core done');
}

const _install = async (name, version, opts) => {
  const realDir = path.join(opts.root, 'node_modules');

  let t = Date.now();
  const exists = await fse.exists(realDir);
  if (exists) {
    if (process.platform == 'win32') {
      debug('use remove');
      await fse.remove(realDir);
    } else {
      debug('use move');
      const trashPath = opts.trash + '_core_' + t;
      await fse.move(realDir, trashPath);
      trash(trashPath);
    }
  }
  debug('trash using: %ds', (Date.now() - t) / 1000);

  t = Date.now();
  await installer({
    'registry': opts.registry || 'https://registry.npmjs.org/',
    'root': opts.root,
    'pkgs': [{'name': name, 'version': version}]
  });
  debug('install using: %ds', (Date.now() - t) / 1000);
}

const checkDependencies = async (dir) => {
  let t = Date.now();
  let pkgData = {};
  try {
    pkgData = await readJson(path.join(dir, 'package.json'));
  } catch(e) {}

  const deps = Object.keys(pkgData.dependencies || {});
  if (deps.length > 0) {
    await deps.map(dep => {
      return new Promise(async (resolve, reject) => {
        try {
          let p = path.join(dir, 'node_modules', dep);
          await fse.exists(p)
          resolve();
        } catch(e) {
          reject(e);
        }
      });
    });
  }
  debug('check using: %ds', (Date.now() - t) / 1000);
}

const confirm = (msg) => {
  return new Promise(function resolver(resolve, reject) {
    process.stdin.setEncoding('utf8');
    process.stdin.resume();

    process.stdout.write(msg);
    process.stdin.once('data', function(data) {
      const choice = data.trim().toLowerCase();
      if (choice == 'y' || choice == '') {
        resolve(true);
      } else {
        resolve(false);
      }
      process.stdin.pause();
    });
  });
}

module.exports = {
  getNodeArgs,
  readJson,
  install,
  confirm
}