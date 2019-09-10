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
import * as child_process from 'child_process'
import * as DEBUG from 'debug'

const debug = DEBUG('weex-cli:generator')
const exec = child_process.execSync

export function gitUser(): string {
  let name
  let email

  try {
    name = exec('git config --get user.name')
    email = exec('git config --get user.email')
  } catch (e) {
    debug('Exec gituser error:', e)
  }

  name = name && JSON.stringify(name.toString().trim()).slice(1, -1)
  email = email && ' <' + email.toString().trim() + '>'
  return (name || '') + (email || '')
}

export default gitUser
