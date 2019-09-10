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
export interface DeviceInfo {
  name: string
  id: string
  isSimulator: Boolean
  version?: string
}

export enum messageType {
  state = 'state',
  outputLog = 'outputLog',
  outputError = 'outputError',
}

export interface RunDeviceOptions {
  /**
   * DeviceInfo.id
   */
  id: string

  /**
   * For ios is `xxx.app` path, if install in real machine the `xxx.app` should auth first
   * For android is `xxx.apk` path
   */
  appPath: string

  /**
   * The id used to launch the application
   * For ios is `BundleIdentifier` ex: com.alibaba.weex
   * For android is `packageName` ex: com.weex.app
   */
  applicationId: string

  /**
   * After star the app some command string of `shell`
   * ex: -d Ws:http://102.323.33:8080
   */
  androidShellCmdString?: string
}
