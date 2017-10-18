#!/usr/bin/env node
const xtoolkit = require('xtoolkit');
const chalk = require('chalk');
const check = require('check-node-version');
const PROGRAMS = check.PROGRAMS;

const options = {
  'node': '>=6',
  'npm': '>=5'
};

const logResult = (result) => {
  // display any non-compliant versions
  Object.keys(PROGRAMS).forEach(function (name) {
    if (result[name].isSatisfied === false) {
      const raw = result[name].wanted.raw;
      const info = result[name];
      const range = result[name].wanted.range;
      console.log(chalk.yellow(`\nWarning:${info.version ? ' Local version is ' + info.version + ',' : ''} Wanted ${name} version ${raw} (${range})`));
      console.log(chalk.grey(PROGRAMS[name].getInstallInstructions(raw)));
    }
  });
};

check(options, (err, result) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
    return;
  }
  logResult(result);
});

// xtoolkit.command('init','local:../src/weex-init.js');
xtoolkit.command('init', 'npm:weexpack.create');
xtoolkit.command('compile', 'npm:weex-builder').locate(require.resolve('weex-builder'));
xtoolkit.command('debug', 'npm:weex-devtool');
xtoolkit.command('', 'npm:weex-previewer').locate(require.resolve('weex-previewer'));
xtoolkit.command('platform', 'npm:weexpack.platform');
xtoolkit.command('plugin', 'npm:weexpack.plugin');
xtoolkit.command('build', 'npm:weexpack.build');
xtoolkit.command('run', 'npm:weexpack.run');
xtoolkit.command('create', 'npm:weexpack.create');
xtoolkit.version(require('../package.json').version);
