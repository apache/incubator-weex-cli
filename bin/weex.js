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
  'npm': '>=4'
};

const logResult = function logResult (result) {
  // display any non-compliant versions
  Object.keys(PROGRAMS).forEach(function (name) {
    const raw = result[name].wanted && result[name].wanted.raw;
    const info = result[name];
    const range = result[name].wanted && result[name].wanted.range;
    if (result[name].isSatisfied === false) {
      logger.log(chalk.yellow('\nWarning:' + (info.version ? ' Local version is ' + info.version + ',' : '') + ' Wanted ' + name + ' version ' + raw + ' (' + range + ')'));
      logger.log(chalk.grey(PROGRAMS[name].getInstallInstructions(raw)));
    }
    else {
      if (info.version.toString().match(/\d+/)[0] === '5') {
        logger.log(chalk.yellow(`
Warning: npm 5 is not supported yet!

${chalk.grey(`It looks like you're using npm 5 which was recently released.
Weex Toolkit doesn't work well with npm 5 yet, unfortunately.

We recommend using npm 4 until some bugs are resolved.
To install npm 4, you can just run \`npm i npm@4 -g\` or use \`n\` to manage your npm version with node.

You can follow the known issues with npm 5 at https://github.com/npm/npm/issues/16991`)}\n`)
        );
      }
    }
  });
};

const checkVersion = () => {
  check(options, function (err, result) {
    if (err) {
      logger.error(err.message);
      process.exit(1);
      return;
    }
    logResult(result);
  });
}

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
  checkVersion()
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
  else if(process.argv[2] === '-v' || process.argv[2] === '--version') {
    checkVersion();
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
