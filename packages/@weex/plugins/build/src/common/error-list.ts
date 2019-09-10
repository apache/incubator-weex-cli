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
import { createError } from '@weex-cli/utils/lib/error/error.js'

export enum ERROR_LIST {
  IOS_CODE_SIGNING_ERROR = 'IOS_CODE_SIGNING_ERROR',
  ANDROID_NOT_FIND_APK_PATH = 'ANDROID_NOT_FIND_APK_PATH',
}

/**
 * When build app for real device, not have correct signing will throw
 */
export const IOS_CODE_SIGNING_ERROR = createError({
  type: ERROR_LIST.IOS_CODE_SIGNING_ERROR,
  message: `Code Signing Error, Please use xcode open project handle singing error.`,
})

export const ANDROID_NOT_FIND_APK_PATH = createError({
  type: ERROR_LIST.ANDROID_NOT_FIND_APK_PATH,
  message: `Not find android apk path, please try set apk path`,
})
