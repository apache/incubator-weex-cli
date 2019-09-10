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
import * as EventEmitter from 'events'
import { BuilderConfig, RunOptions, messageType } from '../common/builder'
import { PLATFORM_TYPES } from '../common/const'
import { exec } from '@weex-cli/utils/lib/process/process.js'

export default class Builder extends EventEmitter {
  public type: PLATFORM_TYPES
  protected config: BuilderConfig

  constructor(options: BuilderConfig, type: PLATFORM_TYPES) {
    super()
    this.checkEnv()
    this.init(options)
    this.on('error', e => {
      // To prevent the collapse
      this.emit(messageType.outputError, e)
    })
    this.type = type
  }

  protected checkEnv() {
    // Do nothing
  }

  private init(options: BuilderConfig) {
    this.config = Object.assign(
      {
        // Some default
      },
      options,
    )
  }

  protected async doPreCmds() {
    const { preCmds } = this.config

    if (!preCmds || preCmds.length < 1) {
      return
    }

    for (let i = 0; i < preCmds.length; i++) {
      await exec(preCmds[i], {}, { cwd: this.config.projectPath })
    }
  }

  public async run(options: RunOptions): Promise<{ appPath: string }> {
    console.error('Not define `buildNative`')
    return null
  }
}
