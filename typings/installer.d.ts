declare module IInstaller {
  interface NpmInstaller {

  }

  interface NpmConfig {
    npm_config_registry: string;
    npm_node_execpath: string;
    npm_execpath: string;
    npm_config_python?: string;
    npm_config_msvs_version?: string;
    [key: string]: string|any;
  }

  interface NpmInstallerOpitons {
    registry: string;
    root: string;
    [key: string]: string|any;
  }
}

