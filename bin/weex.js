#!/usr/bin/env node
'use strict';

const xtoolkit = require('xtoolkit');
const chalk = require('chalk');
const check = require('check-node-version');
// const path = require('path');
const PROGRAMS = check.PROGRAMS;

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

// const commandName = 'weex';

// const userinfo = '\nUsage: ' + commandName + ' <command>';
// // This command help message is for weex-toolkit.
// const command = `
// where <command> is one of:

//   debug         Start weex debugger
//   config        Configure the global configuration file
//   compile       Compile we/vue file
//   create        Create a weexpack project
//   preview       Preview a weex page
//   platform      Add/remove ios/android platform
//   plugin        Add/remove weexplugin
//   run           Build your ios/android app and run
//   update        Update weex package version
//   xbind         Binding a thrid-part tool

//   weex <command> --help      help on <command>
// `;

// const isPreview = (file) => {
//   const ext = path.extname(file);
//   if (ext === '.vue' || ext === '.we') {
//     return true;
//   }
//   return false;
// };

// if (process.argv.length <= 3) {
//   // Compatible with `weex xxx.vue`
//   if (process.argv[2] && isPreview(process.argv[2])) {
//     console.warn(chalk.yellow(`\nplease using \`weex preview ${process.argv[2]}\``));
//   }
//   else {
//     console.log(userinfo);
//     console.log(command);
//   }
// }

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
