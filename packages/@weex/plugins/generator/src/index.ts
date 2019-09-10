/* Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { TEMPLATE_NAME } from './utils/index'
import * as path from 'path'
import * as fs from 'fs'
import render from './render'
import * as rimraf from 'rimraf'
import * as download from 'download-git-repo'
import options from './options'

interface Metadate {
  [propName: string]: any
}

const defautlTarget = path.join(path.dirname(__dirname), TEMPLATE_NAME)

/**
 * Generate source with meatdata
 *
 * @export
 * @param {string} source
 * @param {string} dest
 * @param {Metadate} metadata
 * @returns {Promise<boolean>}
 */
export function generator(source: string, dest: string, metadata: Metadate): Promise<any> {
  return render(source, dest, metadata)
}

interface CloneOption {
  cache: boolean
  clone: boolean
}

/**
 * Download template from a specify url
 *
 * @export
 * @param {string} templateUrl
 * @param {*} [target=defautlTarget]
 * @param {CloneOption} [option]
 * @returns
 */
export function clone(templateUrl: string, target = defautlTarget, option?: CloneOption) {
  return new Promise((resolve, reject) => {
    if (option && option.cache) {
      resolve(target)
    } else if (fs.existsSync(target)) {
      rimraf(target, () => {
        done()
      })
    } else {
      done()
    }
    function done() {
      download(templateUrl, target, { clone: option.clone }, err => {
        // download('direct:https://github.com/balloonzzq/webpack.git#temp', target, { clone: true }, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(target)
        }
      })
    }
  })
}

/**
 * Get options from template's meta.json or meta.js
 *
 * @export
 * @param {string} name
 * @param {string} dir
 * @param {*} opt
 * @returns
 */
export function getOptions(name: string, dir: string, opt: Metadate) {
  return options(name, dir, opt)
}
