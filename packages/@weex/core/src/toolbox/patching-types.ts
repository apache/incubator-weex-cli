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

export interface IPatching {
  /**
   * Checks if a string or pattern exists in a file.
   */
  exists(filename: string, findPattern: string | RegExp): Promise<boolean>
  /**
   * Updates a file.
   */
  update(filename: string, callback: (contents: any) => any): Promise<string | object | boolean>
  /**
   * Appends to the end of a file.
   */
  append(filename: string, contents: string): Promise<string | boolean>
  /**
   * Prepends to the start of a files.
   */
  prepend(filename: string, contents: string): Promise<string | boolean>
  /**
   * Replaces part of a file.
   */
  replace(filename: string, searchFor: string, replaceWith: string): Promise<string | boolean>
  /**
   * Makes a patch inside file.
   */
  patch(filename: string, options: IPatchingPatchOptions): Promise<string | boolean>
}

export interface IPatchingPatchOptions {
  /* String to be inserted */
  insert?: string
  /* Insert before this string */
  before?: string
  /* Insert after this string */
  after?: string
  /* Replace this string */
  replace?: string
  /* Delete this string */
  delete?: string
  /* Write even if it already exists  */
  force?: boolean
}
