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
import Filter from './Filter'
import Router from './Router'
import Message from './Message'
import { TerminalEvent } from './Terminal'

import * as DEBUG from 'debug'
const debug = DEBUG('hub')

const _hubInstances: any = {}

export default class Hub {
  private terminalMap: any = {}
  private filterChain: any[] = []
  private _pushToRouter: any
  id: string
  router: Router = null
  constructor(id: string) {
    if (_hubInstances[id]) {
      return _hubInstances[id]
    }
    _hubInstances[id] = this
    this.id = id

    this._pushToRouter = new Filter(async message => {
      const response = await this.router.fetchMessage(message)
      return response
    })
  }

  static get(id: string) {
    return _hubInstances[id] || new Hub(id)
  }

  static check() {
    Object.keys(_hubInstances).forEach(id => {
      if (!_hubInstances[id].router) {
        console.error(`Error: Hub[${id}] not join in any router`)
      }
    })
  }

  join(terminal: any, forced: boolean = false) {
    if (!this.router) {
      debug('A Hub must be linked with a Router before join terminals')
      throw new Error('A Hub must be linked with a Router before join terminals')
    }
    if (!this.terminalMap[terminal.id]) {
      terminal.hub = this.id
      if (forced) {
        let replace: boolean = false
        for(let index in this.terminalMap) {
          if (this.terminalMap[index].hub === terminal.hub) {
            this.setupTerminal(terminal, forced)
            let disposeTerminal = this.terminalMap.splice(index, 1, terminal)
            disposeTerminal.close()
            replace = true
          }
        }
        if (!replace) {
          this.terminalMap[terminal.id] = terminal
          this.setupTerminal(terminal, forced)
        }
      } else {
        this.terminalMap[terminal.id] = terminal
        this.setupTerminal(terminal, forced)
      }
    } else {
      debug('Cannot add terminal into some hub')
      throw new Error('Cannot add terminal into some hub')
    }
  }

  setChannel(terminalId: string, channelId: string) {
    if (this.terminalMap[terminalId]) {
      this.terminalMap[terminalId].channelId = channelId
    } else {
      throw new Error(`Can not find terminal[${terminalId}]`)
    }
  }

  setupTerminal(terminal: any, forced: boolean) {
    terminal.on(TerminalEvent.TERMINAL_DESTROY, () => {
      if (this.terminalMap[terminal.id]) {
        delete this.terminalMap[terminal.id]
        this.router.event({
          type: Router.Event.TERMINAL_LEAVED,
          terminalId: terminal.id,
          hubId: this.id,
          channelId: terminal.channelId,
        })
        terminal = null
      } else {
        debug('Try to delete a non-exist terminal')
      }
    })
    terminal.on(TerminalEvent.TERMINAL_MESSAGE, async message => {
      await this.send(new Message(message, this.id, terminal.id, terminal.channelId))
    })
    this.router.event({
      type: Router.Event.TERMINAL_JOINED,
      terminalId: terminal.id,
      hubId: this.id,
      channelId: terminal.channelId,
      forced: forced,
    })
  }

  broadcast(message: Message) {
    for (const id in this.terminalMap) {
      if (this.terminalMap.hasOwnProperty(id)) {
        this.terminalMap[id].read(message.payload)
      }
    }
    message.destroy()
  }

  pushToTerminal(terminalId: string, message: Message) {
    if (this.terminalMap[terminalId]) {
      this.terminalMap[terminalId].read(message.payload)
    } else {
      debug(`Terminal [${terminalId}] not found on terminalMap ${this.id}`)
    }
  }

  async send(message: Message) {
    if (!this.router) {
      throw new Error('this hub not linked with a router,message send failed!')
    }
    try {
      await Filter.resolveFilterChain(message, this.filterChain.concat(this._pushToRouter))
    } catch(error) {
      debug(`Don't know why there has a crash, ${error}`)
    }
  }

  filter(filter: any, condition: any) {
    this.filterChain.push(new Filter(filter, condition))
  }
}
