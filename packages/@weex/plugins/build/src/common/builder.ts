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
import { PLATFORM_TYPES } from './const'
import { ExecOptions } from '@weex-cli/utils/lib/process/process.js'

export enum messageType {
  state = 'state',
  outputLog = 'outputLog',
  outputError = 'outputError',
}
export interface BuilderConfig {
  type: PLATFORM_TYPES

  /**
   * Ios or Android project path
   */
  projectPath: string

  /**
   * Before Build some cmd, just like `['pod update']`
   */
  preCmds?: Array<string>
}

export interface IosBuilderConfig extends BuilderConfig {
  /**
   * Build for real device or not
   */
  isRealDevice?: boolean
  [key: string]: any
}

export interface AndroidBuilderConfig extends BuilderConfig {
  /**
   * The build android apk location, set in gradle config
   * If not set apkPth will try find  `app/build/outputs/apk/*.apk`
   */
  apkPath?: string
}

export interface RunOptions extends ExecOptions {
  [key: string]: any
}
