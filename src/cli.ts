#!/usr/bin/env node

"use strict";
require('./bootstrap');
const fse = require('fs-extra');
const colors = require('colors/safe');
const minimist = require('minimist');
const pathExists = require('path-exists');
const semver = require('semver');
const spawn = require('cross-spawn');
const userhome = require('userhome');
const dotenv = require('dotenv');
const pkg = require('../package.json');

class Cli implements ICommandLine.ICommandCore {
  argv: any;
  env: any;
  cmd: string;
  logger: any = $injector.resolve('logger');
  coreData:ICommandLine.CommandCoreData = {
    'coreName': '',
    'coreRoot': '.core',
    'coreTrash': '.trash'
  };
  defaultConfig: ICommandLine.CommandCoreConfig = {
    home: userhome('.weex'),
    registry: 'https://registry.npmjs.org/',
    nodeVersion: '6.0.0',
    nodeUsed: 'bundle',
    telemetry: true
  };
  process: NodeJS.Process;

  constructor(process:NodeJS.Process) {
    this.logger.warn('test');
    // assign some values from process
    this.process = process;
    this.argv = minimist(process.argv.slice(2));
    this.env = process.env;
    this.cmd = this.argv._[0];

    // check if user has use `sudo` or not
    this.rootCheck();
    // check if there has userhome floder
    this.homeCheck();
    // initial command
    this.init();
  }

  private rootCheck() {
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
  }

  private homeCheck() {
    if (!userhome()) {
      console.error(colors.red('ERROR: can not find HOME directory.'));
      this.process.exit(1);
    }
  }

  private init() {

    dotenv.config({
      'path': userhome('.weex', '.env'),
      'silent': true
    });

    if (process.env.WEEX_HOME) {
      this.defaultConfig['home'] = process.env.WEEX_HOME;
    }
    if (process.env.WEEX_ENV) {
      this.defaultConfig['env'] = process.env.WEEX_ENV;
    }
    if (process.env.WEEX_REGISTRY) {
      this.defaultConfig['registry'] = process.env.WEEX_REGISTRY;
    }
    if (process.env.WEEX_NODE_USED) {
      this.defaultConfig['nodeUsed'] = process.env.WEEX_NODE_USED;
    }

    // init coreData
    this.coreData.corePath = userhome('.core', 'node_modules', this.coreData.coreName);

    if (this.env.DEF_CORE_PATH) {
      this.coreData.corePath = this.env.DEF_CORE_PATH;
    }
  }

  // log($logger?:any) {
  //   $logger.warn(test);
  // }
  // register (name: string, resource: any) {
  //   this.$injector[name] = new resource();
  // }

  // resolve(target: any) {
  //   const FN_ARGS = /^\s*[^\(]*\(\s*([^\)]*)\)/m;
  //   const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  //   const stringOfFunction = target.toString().replace(STRIP_COMMENTS, '');
  //   const argumentDeclare = stringOfFunction.match(FN_ARGS)[1].split(/, ?/g);
  //   const args: any[] = [];
  //   for (let i = 0; i < argumentDeclare.length; i++ ) {
  //     if (this.$injector[argumentDeclare[i]]) {
  //       args.push(this.$injector[argumentDeclare[i]]);
  //     }
  //   }
  //   return function() {
  //     target.apply({}, args);
  //   };
  // }

}

module.exports = Cli;
