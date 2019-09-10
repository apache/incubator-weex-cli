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
import { CLIEngine } from 'eslint'

export default class WeexLinter {
  private engine: CLIEngine

  private defaultOptions: CLIEngine.Options = {
    useEslintrc: false,
    extensions: ['.js', '.vue'],
    baseConfig: {
      extends: ['eslint-config-weex/vue'],
    },
  }

  constructor(options: CLIEngine.Options) {
    this.engine = new CLIEngine(Object.assign(options, this.defaultOptions))
  }

  public executeOnFiles(files) {
    return this.engine.executeOnFiles(files)
  }

  public executeOnText(sourcecode) {
    return this.engine.executeOnText(sourcecode)
  }

  public getConfigForFile(printConfig) {
    return this.engine.getConfigForFile(printConfig)
  }

  public outputFixes(report) {
    return CLIEngine.outputFixes(report)
  }

  public getErrorResults(report) {
    return CLIEngine.getErrorResults(report)
  }

  public getFormatter(code) {
    return this.engine.getFormatter(code)
  }
}
