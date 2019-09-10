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
export enum runnerState {
  start,
  startServerDone,
  setNativeConfigDone,
  copyJsBundleDone,
  watchFileChangeDone,
  buildNativeDone,
  installAndLaunchAppDone,
  done,
}

export enum messageType {
  state = 'state',
  outputLog = 'outputLog',
  outputError = 'outputError',
}

export interface RunnerConfig {
  /**
   * Will watch this folder *.js change
   */
  jsBundleFolderPath: string

  /**
   * Which file change trigger hot reload (path relative `jsBundleFolderPath`)
   * Now only support one js bundle hot reload
   */
  jsBundleEntry: string

  /**
   * Weex Ios or Android project path
   */
  projectPath: string

  /**
   * Ios or Android device id
   */
  deviceId: string

  /**
   * Ios or Android application id
   */
  applicationId: string

  /**
   *  The content of `ios.config.json` or 'android.config.json'
   */
  nativeConfig?: any
}
