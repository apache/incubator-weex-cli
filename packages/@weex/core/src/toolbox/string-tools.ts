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

import { is, isEmpty, pipe } from 'ramda'

import * as camelCase from 'lodash.camelcase'
import * as kebabCase from 'lodash.kebabcase'
import * as lowerCase from 'lodash.lowercase'
import * as lowerFirst from 'lodash.lowerfirst'
import * as pad from 'lodash.pad'
import * as padEnd from 'lodash.padend'
import * as padStart from 'lodash.padstart'
import * as repeat from 'lodash.repeat'
import * as snakeCase from 'lodash.snakecase'
import * as startCase from 'lodash.startcase'
import * as trim from 'lodash.trim'
import * as trimEnd from 'lodash.trimend'
import * as trimStart from 'lodash.trimstart'
import * as upperCase from 'lodash.uppercase'
import * as upperFirst from 'lodash.upperfirst'
import * as pluralize from 'pluralize'
import { IStrings } from './strings-types'

/**
 * Is this not a string?
 *
 * @param value The value to check
 * @return True if it is not a string, otherwise false
 */
function isNotString(value: any): boolean {
  return !is(String, value)
}

/**
 * Is this value a blank string?
 *
 * @param value The value to check.
 * @returns True if it was, otherwise false.
 */
function isBlank(value: any): boolean {
  return isNotString(value) || isEmpty(trim(value))
}

/**
 * Returns the value it is given
 *
 * @param value
 * @returns the value.
 */
function identity(value: any): any {
  return value
}

/**
 * Converts the value ToPascalCase.
 *
 * @param value The string to convert
 * @returns PascalCase string.
 */
function pascalCase(value?: string): string {
  // make tslint work
  const pipeFn: any = pipe(
    camelCase,
    upperFirst,
  )
  return pipeFn(value) as string
}

/**
 * Compare similarity from two string
 *
 * @param s origin string
 * @param t compare string
 * @returns number
 */
function strSimilarity2Number(s: string, t: string): number {
  let n = s.length
  let m = t.length
  let d = []
  let i
  let j
  let sTmp
  let tTmp
  let cost
  if (n === 0) return m
  if (m === 0) return n
  for (i = 0; i <= n; i++) {
    d[i] = []
    d[i][0] = i
  }
  for (j = 0; j <= m; j++) {
    d[0][j] = j
  }
  for (i = 1; i <= n; i++) {
    sTmp = s.charAt(i - 1)
    for (j = 1; j <= m; j++) {
      tTmp = t.charAt(j - 1)
      if (sTmp === tTmp) {
        cost = 0
      } else {
        cost = 1
      }
      d[i][j] = minimum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
    }
  }
  return d[n][m]
}

/**
 * Transform number to percent
 *
 * @param s origin string
 * @param t compare string
 * @returns number
 */
function strSimilarity2Percent(s: string, t: string): number | string {
  let l = s.length > t.length ? s.length : t.length
  let d = strSimilarity2Number(s, t)
  return (1 - d / l).toFixed(4)
}

/**
 * Return to minimum
 */
function minimum(a, b, c) {
  return a < b ? (a < c ? a : c) : b < c ? b : c
}

export { IStrings }

export const strings: IStrings = {
  isNotString,
  isBlank,
  identity,
  pascalCase,
  camelCase,
  kebabCase,
  lowerCase,
  lowerFirst,
  pad,
  padEnd,
  padStart,
  repeat,
  snakeCase,
  startCase,
  trim,
  trimEnd,
  trimStart,
  upperCase,
  upperFirst,
  pluralize,
  plural: pluralize.plural,
  singular: pluralize.singular,
  addPluralRule: pluralize.addPluralRule,
  addSingularRule: pluralize.addSingularRule,
  addIrregularRule: pluralize.addIrregularRule,
  addUncountableRule: pluralize.addUncountableRule,
  isPlural: pluralize.isPlural,
  isSingular: pluralize.isSingular,
  strSimilarity2Percent,
  strSimilarity2Number,
}
