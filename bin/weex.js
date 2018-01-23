#!/usr/bin/env node
'use strict';

const xtoolkit = require('xtoolkit');
const chalk = require('chalk');
const check = require('check-node-version');
const path = require('path');
const PROGRAMS = check.PROGRAMS;
const {
  logger
} = require('../lib/utils');

const options = {
  'node': '>=6',
  'npm': '>=5'
};

const logResult = function logResult (result) {
  // display any non-compliant versions
  Object.keys(PROGRAMS).forEach(function (name) {
    if (result[name].isSatisfied === false) {
      const raw = result[name].wanted.raw;
      const info = result[name];
      const range = result[name].wanted.range;
      logger.warn('Warning:' + (info.version ? ' Local version is ' + info.version + ',' : '') + ' Wanted ' + name + ' version ' + raw + ' (' + range + ')');
      logger.log(chalk.grey(PROGRAMS[name].getInstallInstructions(raw)));
    }
  });
};

check(options, function (err, result) {
  if (err) {
    logger.error(err.message);
    process.exit(1);
    return;
  }
  logResult(result);
});

const commandName = 'weex';

const userinfo = '\nUsage: ' + commandName + ' <command>';
// This command help message is for weex-toolkit.
const command = `
where <command> is one of:

  debug         Start weex debugger
  config        Configure the global configuration file
  compile       Compile we/vue file
  create        Create a weexpack project
  preview       Preview a weex page
  platform      Add/remove ios/android platform
  plugin        Add/remove weexplugin
  run           Build your ios/android app and run
  update        Update weex package version
  xbind         Binding a thrid-part tool

  weex <command> --help      help on <command>
`;

const isPreview = (file) => {
  const ext = path.extname(file);
  if (ext === '.vue' || ext === '.we') {
    return true;
  }
  return false;
};

const showHelp = () => {
  logger.log(userinfo);
  logger.log(command);
};

if (process.argv.length <= 3) {
  // Compatible with `weex xxx.vue`
  if (process.argv[2] && isPreview(process.argv[2])) {
    logger.warn(`we suggest you to use \`weex preview ${process.argv[2]}\`, that's more readable.`);
  }
  else if (process.argv[2] === '-h' || process.argv[2] === '--help') {
    showHelp();
  }
  else if (!process.argv[2]) {
    showHelp();
  }
}

xtoolkit.command('init', 'npm:weexpack.create');
xtoolkit.command('debug', 'npm:weex-debugger');
xtoolkit.command('compile', 'npm:weex-builder').locate(require.resolve('weex-builder'));
xtoolkit.command('preview', 'npm:weex-previewer').locate(require.resolve('weex-previewer'));
xtoolkit.command('platform', 'npm:weexpack.platform');
xtoolkit.command('plugin', 'npm:weexpack.plugin');
xtoolkit.command('build', 'npm:weexpack.build');
xtoolkit.command('run', 'npm:weexpack.run');
xtoolkit.command('create', 'npm:weexpack.create');
xtoolkit.version(require('../package.json').version);
