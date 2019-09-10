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
const debug = DEBUG('handler')
import Router from './Router'
import Message from './Message'
import utils from './utils'
export default class Handler {
  private handler: any
  private router: Router
  private fromString: string
  private condition: any

  static async run(handlerList: any[], message: Message, i: number = 0) {
    return new Promise(async (resolve, reject) => {
      const handler = handlerList[i]
      if (handler) {
        // The handler's constructor is Handler
        // so the handler.run function must be an async function
        // and it will return the message which include by the prev function
        let result = await handler.run(message)
        if (i + 1 < handlerList.length) {
          let subResult = await Handler.run(handlerList, result || message, i + 1)
          resolve(subResult)
        } else {
          resolve(result)
        }
      } else {
        debug(`There has not handler for index[${i}]`)
        reject(new Error(`There has not handler for index[${i}]`))
      }
    })
  }

  constructor(handler: any, router: Router) {
    this.handler = handler
    this.router = router
  }

  at(fromString: string) {
    this.fromString = fromString
    return this
  }

  when(condition: any) {
    if (typeof condition === 'string') {
      this.condition = new Function('message', 'with(message) {return ' + condition + ';}')
    } else if (typeof condition === 'function') {
      this.condition = condition
    }
    return this
  }

  test(message: Message) {
    return message.match(this.fromString) && (!this.condition || this.condition(message))
  }

  async run(message: Message) {
    if (this.test(message)) {
      if (utils.isAsyncFuction(this.handler)) {
        await this.handler.call(this.router, message)
      } else {
        this.handler.call(this.router, message)
      }
    }
    return message
  }
}
