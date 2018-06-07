'use strict';

const pkg = require('../package.json');
const colors = require('colors/safe');
const semver = require('semver');
const spawn = require('cross-spawn');
const path = require('path');
const userhome = require('userhome');
const fse = require('fs-extra');
const { getNodeArgs } = require('./util');

const { installUncaughtExceptionListener } = require('./errors');

// first, do a sniff test to ensure our dependencies are met
const sniff = require('./sniff')

// check the node version
if (!sniff.isNewEnough) {
  console.log('Node.js 7.6+ is required to run. You have ' + sniff.nodeVersion + '.');
  process.exit(1);
}

installUncaughtExceptionListener();

// check if user has use `sudo` or not
if (process.env.WEEX_ALLOW_SUDO) {
  console.log('root privileges downgrade skipped');
} else {
  require('root-check')(`
  ${colors.red('Please don\'t use `sudo` to run the command.')}

  If you can't run without sudo, you may have problems during installation.
  Try to run ${colors.underline('sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}')} command to empower your folders.
  `
  );
}

// check if there has userhome floder
if (!userhome()) {
  console.error(colors.red('ERROR: can not find HOME directory.'));
  this.process.exit(1);
}

const cli = (processArgv) => {
  const coreFile = path.join(__dirname, '../packages', '@weex/core');
  const coreConfigs = {
    argv: processArgv
  };
  const coreOptions = {};

  // check if we're running in dev mode
  const devMode = fse.existsSync(`${coreFile}/src`);
  const wantsCompiled = coreConfigs.argv.indexOf('--compiled') >= 0;

  let coreCode;
  if (devMode && !wantsCompiled) {
    // hook into ts-node so we can run typescript on the fly
    require('ts-node').register({ project: `${coreFile}/tsconfig.json` })
    require(`${coreFile}/src/cli/cli`).run(process.argv)
  } else {
    require(`${coreFile}/lib/cli/cli`).run(process.argv)
  }
}

module.exports = cli;
