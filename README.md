# Weex Toolkit

![image | left](https://img.shields.io/badge/PRs-welcome-brightgreen.svg "")
![image | left](https://img.shields.io/badge/license-Apache--2.0-brightgreen.svg "")
[![GitHub issues](https://img.shields.io/github/issues/weexteam/weex-toolkit.svg)](https://github.com/weexteam/weex-toolkit/issues)
[![Npm package](https://img.shields.io/npm/dm/weex-toolkit.svg)](https://www.npmjs.com/package/weex-toolkit)
[![Build status](https://ci.appveyor.com/api/projects/status/dy89sm44bcggc12q/branch/dev?svg=true)](https://ci.appveyor.com/project/erha19/weex-toolkit/branch/dev)

> Weex Toolkit is the Standard Tooling for Weex Development.

## Introduction

> This document is for the `weex-toolkit` **2.x** version. For the old version of the `weex-toolkit` documentation, please go to [here] (https://github.com/weexteam/weex-toolkit/blob/v1.0/README.md).


[Weex Toolkit](https://github.com/weexteam/weex-toolkit) is dedicated to standardizing the tool base in the Weex ecosystem. It ensures that various build tools can be seamlessly connected based on smart default configuration, so you can focus on writing applications without having to spend days tangling configuration issues.

## System Components

[Weex Toolkit](https://github.com/weexteam/weex-toolkit) split each function module into separate parts, if you see our [source code](https://github.com/weexteam/weex-toolkit/tree/master/packages/%40weex) , you will find that we manage multiple separate releases in the repository via [Lerna](https://lernajs.io/) Package, providing the following functional modules:

## Getting Started

### Reuirements

- node >= 7.6.0
- iOS developer tools like `XCode`
- Android SDK and ADB

Now you can install the beta version use below command:

```base
$ npm i weex-toolkit@beta -g
```

To know more detail about the command, you can run:

```base
$ weex --help
```

Also you can see the document [here](https://weex.io/tools/toolkit.html).

## License

[MIT](https://github.com/weexteam/weex-toolkit/blob/dev/LICENSE)