const execSync = require('child_process').execSync;
const npmii = require('npminstall');
const utils = require('npminstall/lib/utils');

import { Env } from './env';

export class Npm implements IInstaller.NpmInstaller {
  public static TIMEOUT:number = 10 * 60 * 1000;
  options: IInstaller.NpmInstallerOpitons;
  config: IInstaller.NpmConfig = {
    npm_config_registry: '',
    npm_node_execpath: '',
    npm_execpath: ''
  };
  constructor(opts: IInstaller.NpmInstallerOpitons) {
    this.options = opts;
    this.config['npm_config_registry'] = opts.registry;
    this.config['npm_node_execpath'] = process.env.NODE || process.execPath;
    this.config['npm_execpath'] = require.main ? require.main.filename : '';
    if (Env.isWindows) {
      const python = this.getPython();
      const msvsVersion = this.getMsvsVersion();
      if (python) {
        this.config['npm_config_python'] = python;
      }
      if (msvsVersion) {
        this.config['npm_config_msvs_version'] = msvsVersion;
      }
    }
  }

  async install(name: string, version?: string) {
    // set mirror env.
    const binaryMirros = await this.getBinaryMirrors(this.config.npm_config_registry);
    for (const key in binaryMirros.ENVS) {
      this.config[key] = binaryMirros.ENVS[key];
    }

    // no proxy
    process.env.NO_PROXY = '*';
    return await npmii({
      'production': true,
      'env': this.config,
      'registry': this.options.registry,
      'binaryMirrors': binaryMirros,
      'timeout': this.options.timeout || Npm.TIMEOUT,
      'strictSSL': this.getStrictSSL(),
      'ignoreScripts': false,
      'root': this.options.root,
      'pkgs': {
        name: name,
        version: version
      }
    });
  }

  async getBinaryMirrors(registry: string) {
    return await utils.getBinaryMirrors(registry);
  }

  getPython() {
    try {
      return execSync('npm config get python').toString().trim();
    } catch (err) {
      console.error('exec npm config get python ERROR:' + err.message);
    }
    return '';
  }

  getMsvsVersion() {
    try {
      return execSync('npm config get msvs_version').toString().trim();
    } catch (err) {
      console.error('exec npm config get msvs_version ERROR:' + err.message);
    }
    return '';
  }

  getStrictSSL() {
    try {
      const strictSSL = execSync('npm config get strict-ssl').toString().trim();
      return strictSSL !== 'false';
    } catch (err) {
      console.error('exec npm config get strict-ssl ERROR: ' + err.message);
      return true;
    }
  }
}
