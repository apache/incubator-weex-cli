# Weex Toolkit

![image | left](https://img.shields.io/badge/PRs-welcome-brightgreen.svg "")
![image | left](https://img.shields.io/badge/license-Apache--2.0-brightgreen.svg "")
[![GitHub issues](https://img.shields.io/github/issues/weexteam/weex-toolkit.svg)](https://github.com/weexteam/weex-toolkit/issues)
[![Npm package](https://img.shields.io/npm/dm/weex-toolkit.svg)](https://www.npmjs.com/package/weex-toolkit)
[![Build status](https://ci.appveyor.com/api/projects/status/dy89sm44bcggc12q/branch/dev?svg=true)](https://ci.appveyor.com/project/erha19/weex-toolkit/branch/dev)

> Weex Toolkit is the Standard Tooling for Weex Development.

## Introduction

> This document is for the `weex-toolkit` **2.x** version. For the old version of the `weex-toolkit` documentation, please go to [here](https://github.com/weexteam/weex-toolkit/blob/v1.0/README.md).


[Weex Toolkit](https://github.com/weexteam/weex-toolkit) is dedicated to standardizing the tool base in the Weex ecosystem. It ensures that various build tools can be seamlessly connected based on smart default configuration, so you can focus on writing applications without having to spend days tangling configuration issues.

## System Components

[Weex Toolkit](https://github.com/weexteam/weex-toolkit) split each function module into separate parts, if you see our [source code](https://github.com/weexteam/weex-toolkit/tree/master/packages/%40weex) , you will find that we manage multiple separate releases in the repository via [Lerna](https://lerna.js.org/) Package, providing the following functional modules:

| Project | Status | Description |
|---------|--------|-------------|
| [@weex-cli/core](https://github.com/weexteam/weex-toolkit/tree/master/packages/@weex/core)          | [![@weex-cli/core](https://img.shields.io/npm/v/@weex-cli/core.svg)](https://www.npmjs.com/package/@weex-cli/core) | Core module for weex-toolkit |
| [@weex-cli/generator](https://github.com/weexteam/weex-toolkit/tree/master/packages/@weex/plugins/generator)          | [![@weex-cli/generator](https://img.shields.io/npm/v/@weex-cli/generator.svg)](https://www.npmjs.com/package/@weex-cli/generator) | Plugin for quickly init the official project |
| [@weex-cli/compile](https://github.com/weexteam/weex-toolkit/tree/master/packages/@weex/plugins/compile)          | [![@weex-cli/compile](https://img.shields.io/npm/v/@weex-cli/compile.svg)](https://www.npmjs.com/package/@weex-cli/compile) | Plugin for quickly compile Weex file. |
| [@weex-cli/preview](https://github.com/weexteam/weex-toolkit/tree/master/packages/@weex/plugins/preview)          | [![@weex-cli/preview](https://img.shields.io/npm/v/@weex-cli/preview.svg)](https://www.npmjs.com/package/@weex-cli/preview) | Plugin for quickly preview the Weex page|
| [@weex-cli/debug](https://github.com/weexteam/weex-toolkit/tree/master/packages/@weex/plugins/debug)          | [![@weex-cli/debug](https://img.shields.io/npm/v/@weex-cli/debug.svg)](https://www.npmjs.com/package/@weex-cli/debug) | Plugin for compile weex files and debug the Weex page|
| [@weex-cli/doctor](https://github.com/weexteam/weex-toolkit/tree/master/packages/@weex/plugins/doctor)          | [![@weex-cli/doctor](https://img.shields.io/npm/v/@weex-cli/doctor.svg)](https://www.npmjs.com/package/@weex-cli/doctor) | Plugin for quickly checks the user's local development environment |
| [@weex-cli/lint](https://github.com/weexteam/weex-toolkit/tree/master/packages/@weex/plugins/lint)         | [![@weex-cli/lint](https://img.shields.io/npm/v/@weex-cli/lint.svg)](https://www.npmjs.com/package/@weex-cli/lint) | Plugin for performs quality diagnostics on local `.vue` files |
| [@weex-cli/device](https://github.com/weexteam/weex-toolkit/tree/master/packages/@weex/plugins/device)          | [![@weex-cli/device](https://img.shields.io/npm/v/@weex-cli/device.svg)](https://www.npmjs.com/package/@weex-cli/device) | Plugin for quickly manages user local devices |
| [@weex-cli/run](https://github.com/weexteam/weex-toolkit/tree/master/packages/@weex/plugins/run)          | [![@weex-cli/run](https://img.shields.io/npm/v/@weex-cli/run.svg)](https://www.npmjs.com/package/@weex-cli/run) | Plugin for quickly run weex's `iOS/Android/Web` project|

## Getting Started

### Reuirements

- node >= 7.6.0
- iOS developer tools like `XCode`
- Android SDK and ADB

Now you can install the latest version use below command:

```base
$ npm i weex-toolkit -g
```

To know more detail about the command, you can run:

```base
$ weex --help
```

Also you can see the document [here](https://weex.apache.org/guide/develop/weex_cli.html).
