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
/**
 * the design is to standardize the Error information,and the user of the interface can obtain
 * the Error type through the Error information to do the corresponding processing
 * 1. A lot of errors may occur in a method, through ` createError ` generates standardized error throw out directly tell the caller,
 *    without having to pass it
 * 2. The interface user can through ` paraError ` to parse out standardized error
 */

const label = 'ErrorMemory'

export function createError(options: { message: string; type: string }) {
  return new Error(
    JSON.stringify(
      Object.assign(
        {
          [label]: 'ErrorMemory',
        },
        options,
      ),
    ),
  )
}

export function formatError(error: Error) {
  let result = null
  try {
    result = JSON.parse(error.message)
  } catch (e) {
    return result
  }

  if (!result[label]) {
    result = null
  }

  delete result[label]

  return result
}
