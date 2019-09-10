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
import * as DEBUG from 'debug'
const debug = DEBUG('filter')

import Handler from './Handler'
import Message from './Message'

export default class Filter {
  static async resolveFilterChain(message: Message, filterChain: any[], currentIndex: number = 0) {
    return new Promise(async (reject, resolve) => {
      let handler: Handler = filterChain[currentIndex]
      if (handler) {
        let result
        try {
          result = await handler.run(message)
        } catch (error) {
          reject(error)
        }
        if (currentIndex + 1 < filterChain.length) {
          try {
            result = await Filter.resolveFilterChain(message, filterChain, currentIndex + 1)
          } catch (error) {
            reject(error)
          }
        }
        resolve(result)
      } else {
        reject(new Error(`There has not handler for index[${currentIndex}]`))
        debug(`There has not handler for index[${currentIndex}]`)
      }
    })
  }
  private condition: any
  handler: any
  constructor(handler: any, condition?: any) {
    this.condition = condition
    this.handler = handler
    if (typeof this.condition === 'string') {
      this.condition = new Function('message', `with(message) {return ${this.condition};}`)
    }
  }

  when(condition: any) {
    if (condition === 'string') {
      this.condition = new Function('message', 'with(message) {return ' + condition + ';}')
    } else {
      this.condition = condition
    }
  }

  async run(message: Message) {
    if (!this.condition || this.condition(message)) {
      debug(`Filter run(${message})`)
      await this.handler(message)
      return true
    } else {
      return false
    }
  }
}
