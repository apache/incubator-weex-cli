// The MIT License (MIT)

//   Copyright (c) 2016-3016 Infinite Red, Inc.

//   Permission is hereby granted, free of charge, to any person obtaining a copy
//   of this software and associated documentation files (the "Software"), to deal
//   in the Software without restriction, including without limitation the rights
//   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//   copies of the Software, and to permit persons to whom the Software is
//   furnished to do so, subject to the following conditions:

//   The above copyright notice and this permission notice shall be included in all
//   copies or substantial portions of the Software.

//   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//   SOFTWARE.

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
export { IMeta } from './extensions/meta-extension'

// this adds the node_modules path to the "search path"
// it's hacky, but it works well!
require('app-module-path').addPath(`${__dirname}/../node_modules`)
require('app-module-path').addPath(process.cwd())
