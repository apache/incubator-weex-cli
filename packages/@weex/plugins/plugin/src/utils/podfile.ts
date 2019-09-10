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
import * as fse from 'fs-extra'

export default {
  applyPatch(file, patch) {
    let content = fse.readFileSync(file, 'utf8')

    if (content.match(patch.findPattern)) {
      content = content.replace(patch.findPattern, '')
    }

    content = content.replace(patch.pattern, match => `${patch.patch}${match}`)
    fse.writeFileSync(file, content)
  },

  makeBuildPatch(name, version) {
    let patch = ''
    if (version) {
      patch = `\tpod '${name}', '${version}'\n`
    } else {
      patch = `\tpod '${name}'\n`
    }

    return {
      pattern: /\t*pod\s+'\w+'\s*,?.*\n/,
      patch: patch,
      findPattern: new RegExp("\\t*pod\\s+'" + name + "'\\s*,?.*\\n", 'g'),
    }
  },

  revokePatch(file, patch) {
    fse.writeFileSync(file, fse.readFileSync(file, 'utf8').replace(patch.findPattern, ''))
  },
}
