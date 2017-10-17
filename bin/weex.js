#!/usr/bin/env node
'use strict';

var xtoolkit = require('xtoolkit');
var chalk = require('chalk');
var check = require('check-node-version');
var PROGRAMS = check.PROGRAMS;

var options = {
  'node': '>=6',
  'npm': '>=5'
};

var logResult = function logResult(result) {
  // display any non-compliant versions
  Object.keys(PROGRAMS).forEach(function (name) {
    if (result[name].isSatisfied === false) {
      var raw = result[name].wanted.raw;
      var info = result[name];
      var range = result[name].wanted.range;
      console.log(chalk.yellow('\nWarning:' + (info.version ? ' Local version is ' + info.version + ',' : '') + ' Wanted ' + name + ' version ' + raw + ' (' + range + ')'));
      console.log(chalk.grey(PROGRAMS[name].getInstallInstructions(raw)));
    }
  });
};

check(options, function (err, result) {
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