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

const isWin = process.platform === 'win32'

export default {
  applyPatch(file, patch, isProject) {
    let content = fse.readFileSync(file, 'utf8')

    if (content.match(patch.findPattern || patch.patch)) {
      content = content.replace(patch.findPattern || patch.patch, '')
    }

    if (patch.findProjectPattern) {
      content = content.replace(patch.findProjectPattern, '')
    }

    if (isProject) {
      content = content.replace(patch.pattern, match => `${match}${patch.projectPatch}`)
    } else {
      content = content.replace(patch.pattern, match => `${match}${patch.patch}`)
    }

    fse.writeFileSync(file, content)
  },

  makeBuildPatch(name, version, groupId) {
    return {
      pattern: /\t*dependencies {\n/,
      projectPatch: `    compile project(':${name}')\n`,
      patch: `    compile '${groupId}:${name}:${version}'\n`,
      findPattern: new RegExp("\t*compile\\s+'" + groupId + ':' + name + ".*'\\n", 'g'),
      findProjectPattern: new RegExp("\t*compile\\s+project\\(':" + name + "'\\).*\\n", 'g'),
    }
  },

  makeSettingsPatch(name, projectDir) {
    /*
     * Fix for Windows
     * Backslashes is the escape character and will result in
     * an invalid path in settings.gradle
     * https://github.com/rnpm/rnpm/issues/113
     */
    if (isWin) {
      projectDir = projectDir.replace(/\\/g, '/')
    }

    return {
      pattern: '\n',
      patch: `include ':${name}'\n` + `project(':${name}').projectDir = ` + `new File('${projectDir}')\n`,
      findPattern: new RegExp(
        "include ':" + name + "'\\nproject\\(':" + name + "'\\).projectDir = new File\\('" + projectDir + "'\\)\\n",
        'g',
      ),
    }
  },

  revokePatch(file, patch) {
    let content = fse.readFileSync(file, 'utf8')
    content = content.replace(patch.findPattern || patch.patch, '').replace(patch.findProjectPattern, '')
    fse.writeFileSync(file, content)
  },
}
