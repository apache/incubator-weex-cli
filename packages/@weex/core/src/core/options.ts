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

/**
 * A flexible object for the many "options" objects we throw around in I.
 */
export interface Options {
  [key: string]: any
}

/**
 * More specific options for loading plugins.
 */
export interface ILoadOptions {
  /**
   * Should we hide this plugin from showing up in the CLI? These types
   * of plugins will still be available to be called directly.
   */
  hidden?: boolean

  /**
   * The file pattern to use when auto-detecting commands. The default is [`*.{js,ts}`, `!*.test.{js,ts}`].
   * The second matcher excludes test files with that pattern. The `ts` extension is only needed for loading
   * in a TypeScript environment such as `ts-node`.
   */
  commandFilePattern?: string[]

  /**
   * The file pattern is used when auto-detecting I extensions.  The default
   * is [`*.{js,ts}`, `!*.test.{js,ts}`]. The `ts` extension is only needed for loading
   * in a TypeScript environment such as `ts-node`.
   */
  extensionFilePattern?: string[]

  /**
   * Specifies if the plugin is required to exist or not. If this is `true` and the plugin
   * doesn't exist, an Error will be thrown.
   */
  required?: boolean

  /**
   * Overrides the name of the plugin.
   */
  name?: string

  /**
   * Provides commands that are provided by the calling CLI rather than loaded from a file.
   */
  preloadedCommands?: object[]
}

export interface IMultiLoadOptions {
  /**
   * Filters the directories to those matching this glob-based pattern. The default
   * is `*` which is all the immediate sub-directories. Setting this to something
   * like `ignite-*` will only attempt to load plugins from directories that start
   * with `ignite-`.
   */
  matching?: string
}
