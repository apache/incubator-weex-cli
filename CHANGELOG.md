## Changelog

### 2.0.0-beta.5

Bugfix:
- bugfix(debug): fix reload logic.
- bugfix(core): fixed [weex-toolkit/issues/510](https://github.com/weexteam/weex-hackernews/issues/86).


### 2.0.0-beta.3

Bugfix:
- bugfix(generator): Buffer is deprecated: since v10.0.0 https://github.com/weexteam/weex-toolkit/commit/25ffa2125ff24af8981b5360ec0610a1df35de7d.
- bugfix(core): fix windows unicode error https://github.com/weexteam/weex-toolkit/commit/d748a4088aa5438b8c7851192abf56ba72dbde95.
- bugfix(plugin): add dependencese https://github.com/weexteam/weex-toolkit/commit/ecd53637f77824d2c00f8e54e9da81fe4a5bb0ee.

Features:
- refactor(debug-server): add @weex-cli/debug-server module https://github.com/weexteam/weex-toolkit/commit/117889a872c1b9072c0b837403d963618f830c33.
- feat(debug): support navigator fake https://github.com/weexteam/weex-toolkit/commit/ba1b7a75cd33921cdb0e7ae091e6da2c17c39420.


### 2.0.0-beta.2
Bugfix:
- bugfix(run): add pluginDependencies of @weex-cli/device https://github.com/apache/incubator-weex/issues/2158.


### 2.0.0-beta.0
Bugfix:
- bugfix(debug): fix inspector error [#3a3e28](https://github.com/weexteam/weex-toolkit/commit/3a3e2844addfb492cd861c2a49675820ef04f451).
- bugfix(debug): fix analyzer error [#4e0e5a](https://github.com/weexteam/weex-toolkit/commit/4e0e5aac90deb754e38f52382309470fddbf20cc).
- bugfix(cli): fix the cli cannot be exit while open a child-process [#fe7519](https://github.com/weexteam/weex-toolkit/commit/fe75195f346a1ac28507901ddbe657c6562d45f2).
- bugfix(compile): fix replace path logic on windows [#bd949a](https://github.com/weexteam/weex-toolkit/commit/bd949a533d8d6a63821d64597098035dc4374926).
- bugfix(core): fix install & update command [#1bfc83](https://github.com/weexteam/weex-toolkit/commit/1bfc83b2eb5b9917030317031695d227a8e536e5).
- bugfix(compile): add css-loader [#bc1919](https://github.com/weexteam/weex-toolkit/commit/bc191936a39c1f8b2bc744ae2fd9569f74f8b29a).
- bugfix(utils): modify import file into lowercase [#bbf066](https://github.com/weexteam/weex-toolkit/commit/bbf066ccb45d120cf5160a78a6d6ef6e97437cf7).

Features:
- feat(debug): support i18n [#45270a](https://github.com/weexteam/weex-toolkit/commit/45270a29e6e93803a6ec259e79e9f56a1f336ba7).
- feat(debug): separate compilation and debugging functions [#2b5b78](https://github.com/weexteam/weex-toolkit/commit/2b5b78d00235802855a9db132073685f57f6bb60).
- feat(debug): support use guidance [#60e0c8](https://github.com/weexteam/weex-toolkit/commit/60e0c80bf46441c1701fe2121c524cd324388167).
- feat(core): support force option [#a24937](https://github.com/weexteam/weex-toolkit/commit/a249374e4aab6a8af9b4e89b0354b248264527ac).
- refactor(compile): use babel 6 instead [#a0368e](https://github.com/weexteam/weex-toolkit/commit/a0368eeb37e9e6165ab64e754b82f169b0582628).
- perf(plugin): remove np module from all packages [#3d28d2](https://github.com/weexteam/weex-toolkit/commit/3d28d263e01bb3cc1d0852440df33955295905d6).


### 2.0.0-alpha.0
- Rlease alpha version for the new CLI.
- Better unit & functional testing support.
- Built with typescript.
- Optimization for the submodules, such as weex-debugger,weexpack and so on.
- Reasonable Node-side command line solution that can be used by all Node-side programs.

### 1.3.7
- Upgrade `xtoolkit` to `v1.0.9`.

### 1.3.7
- Remove useless log message from xtoolkit.

### 1.3.6
- Fixed dns timeout error on xtoolkit.

### 1.3.5
- Add `weex remove` command to remove a package from weex-toolkit.
- Add upgrade notify for weex-toolkit.
- Fixed [issue 373](https://github.com/weexteam/weex-toolkit/issues/373).
- Fixed [issue 363](https://github.com/weexteam/weex-toolkit/issues/363).

### 1.3.4
- Fixed parse error while checking update infomation of the package.
- Upgrade `xtoolkit` to `v1.0.4`.

### 1.3.3
- Fixed `info.version.toString()` throw error on windows.

### 1.3.2
- Upgrade `xtoolkit` to `v1.0.3`.
- Fixed the error of `getaddrinfo ENOTFOUND` cause by no protocol http request.

### 1.3.1
- Reduce the interference caused by the presentation of information.
- Upgrade `weex-builder` to `v0.3.19`.
- Upgrade `weex-previewer` to `v1.5.0`.

### 1.3.0
- Optimized version display interface while running `weex [command] -v`.

### 1.2.10
- Change recommand npm version to 4, cause of the [issues](https://github.com/npm/npm/issues/16991) on npm5.
- Add changelog tips while a package can be upgreaded.

### 1.2.9
- Fix issues [local loader cann't be resolve](https://github.com/weexteam/weex-builder/commit/346f7c37b0032f17b023d80c9e15306764484d23).
- Format the log time to `00:00:00`.
- Optimize the configuration of the write operation.

### 1.2.8
- Fix issues [weexteam/weex-toolkit/issues/251](https://github.com/weexteam/weex-toolkit/issues/251)

### 1.2.7
- Upgrade `xtoolkit` to `0.2.19`.
- Fix issues [weexteam/weex-toolkit/issues/236](https://github.com/weexteam/weex-toolkit/issues/236).

### 1.2.6
- Upgrade `xtoolkit` to `0.2.18`.
- Fix issues [weexteam/weex-toolkit/issues/236](https://github.com/weexteam/weex-toolkit/issues/236).

### 1.2.5
- Fix the path error of `weex-toolkit`.
- Fix issues [weexteam/weex-toolkit/issues/236](https://github.com/weexteam/weex-toolkit/issues/236).
- Add `babel-cli` to compile the source code to ES5 code.

### 1.2.4
- Upgrade `xtoolkit` to `0.2.17`. 
- Fix issues [weexteam/weex-toolkit/issues/236](https://github.com/weexteam/weex-toolkit/issues/236)

### 1.2.3
- Upgrade `xtoolkit` to `0.2.16`. 

### 1.2.1
- Upgrade `xtoolkit` to `0.2.15`.

### 1.2.0
- Add logger setting logic, you can look more detail log by using `--verbose` or `--setloglevel`.
- Upgrade `weex-builder` to `0.3.12`.
- Upgrade `weex-previewer` to `1.4.4`.
- Upgrade `xtoolkit` to `0.2.14`.


### 1.1.0
- Bug fix.
- Support directory hot compile automatically.
- Increased port auto-adaptation & more beautiful log.
- Update weex-loader to v0.5.3.
 
### 1.0.3
- A brand new toolkit release
- Base on xtoolkit which can manager child command
- Auto setup child command if need
- Auto check the version of child command package and upgrade
- Contains weexpack now
- A new weex compiler
- Support vue2.0 
- New preview page