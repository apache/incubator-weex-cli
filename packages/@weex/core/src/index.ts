// export the `build` command
export { build } from './core/builder'

// export all interface
export { IToolbox, IRunContext, IParameters } from './core/toolbox'
export { ICommandLine } from './core/command'

// export the toolbox
export { fs, IFilesystem } from './toolbox/fs-tools'
export { strings, IStrings } from './toolbox/string-tools'
export { logger, ILOGGER } from './toolbox/logger-tools'
export { system, ISystem } from './toolbox/system-tools'
export { semver, ISemver } from './toolbox/semver-tools'
export { http, IHttp } from './toolbox/http-tools'
export { patching, IPatching, IPatchingPatchOptions } from './toolbox/patching-tools'
export { inquirer, IInquirer } from './toolbox/inquirer-tools'
export { open } from './toolbox/open-tools'
export { install, InstallerOption } from './toolbox/installer-tools'

// TODO: can't export these tools directly as they require context to run
// need ideas on how to handle this
export { ITemplate } from './extensions/template-extension'
export { IMeta } from './extensions/meta-extension'

// this adds the node_modules path to the "search path"
// it's hacky, but it works well!
require('app-module-path').addPath(`${__dirname}/../node_modules`)
require('app-module-path').addPath(process.cwd())
