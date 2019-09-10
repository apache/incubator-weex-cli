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
import Channel, { CHANNEL_MODE } from './Channel'
import Handler from './Handler'
import Emitter from './Emitter'
import Message from './Message'
import Hub from './Hub'

import * as DEBUG from 'debug'
const debug = DEBUG('router')

const _routerInstances: any = {}

export default class Router extends Emitter {
  private channelMap: any = {}
  private handlerList: any = {}
  id: string
  hubs: any

  constructor(id: string) {
    super()
    if (_routerInstances[id]) {
      return _routerInstances[id]
    }
    this.hubs = {}
    this.id = id
    this.channelMap = {}
    this.handlerList = []
    _routerInstances[id] = this
  }

  static check() {
    Object.keys(_routerInstances).forEach(id => {
      if (Object.keys(_routerInstances[id].hubs).length === 0) {
        console.error(`Error: Router[${id}] do not has any hub.`)
      }
    })
  }

  static get(id: string) {
    return _routerInstances[id] || new Router(id)
  }

  static dump() {
    Object.keys(_routerInstances).forEach(id => {
      const router = _routerInstances[id]
      for (const hid in router.hubs) {
        debug(`Router[${id}] <----> Hub[${hid}]`)
      }
    })
  }

  static Event = {
    TERMINAL_JOINED: 0,
    TERMINAL_LEAVED: 1,
    MESSAGE_RECEIVED: 2,
  }

  static HubId = 'switchboard'

  link(hub: Hub) {
    this.hubs[hub.id] = hub
    hub.router = this
  }

  reply(message: Message, payload: any) {
    this.pushMessage(message._from.hubId, message._from.terminalId, payload)
  }

  newChannel(channelId: string, mode?: CHANNEL_MODE) {
    const channel: Channel = new Channel(channelId, mode)
    this.channelMap[channel.id] = channel
    return channel.id
  }

  // fixme
  async pushMessageByChannelId(hubId: string, channelId: string, payload: any) {
    const message: Message = new Message(payload, Router.HubId, 'unknown', channelId)
    message.to(hubId)
    message.route()
    await this.fetchMessage(message)
  }

  pushMessage(hubId: any, terminalId: any, payload?: any) {
    if (arguments.length === 2) {
      payload = terminalId
      if (typeof hubId === 'string') {
        [hubId, terminalId] = hubId.split('@')
      } else if (typeof hubId === 'object') {
        hubId = hubId.hubId
        terminalId = hubId.terminalId
      } else {
        debug(`Error: The first argument of pushMessage must be a string or object`)
      }
    }
    const message = new Message(payload, Router.HubId, 'unknown')
    message.to(hubId, terminalId)
    message.route()
    this._pushMessage(message)
  }

  private _pushMessage(message: Message) {
    message.destination.forEach(dest => {
      if (this.hubs[dest.hubId]) {
        if (Array.isArray(dest.terminalId) && dest.terminalId.length > 0) {
          dest.terminalId.forEach(terminal => {
            this.hubs[dest.hubId].pushToTerminal(terminal, message)
          })
        } else if (typeof dest.terminalId === 'string' && dest.terminalId) {
          this.hubs[dest.hubId].pushToTerminal(dest.terminalId, message)
        } else {
          this.hubs[dest.hubId].broadcast(message)
        }
      } else {
        debug(`Error: Hub [' + dest.hubId + '] not found`)
      }
      
    })
    message.destroy()
  }

  dispatchMessage(message: Message) {
    if (message.isAlive()) {
      message.route((from, to, channelId) => {
        if (channelId) {
          const channel = this.channelMap[channelId]
          if (channel) {
            const others = channel.findOthers(from.hubId, from.terminalId, to.hubId)
            if (others.length === 0) channel.pushCache(message.selectOne(to))
            return others
          } else {
            debug(`There should be a connection that request to a close device, invalid channelId: ${channelId}`)
          }
        } else {
          debug(`Error: Invalid message no channelId`)
        }
      })
      this._pushMessage(message)
    }
  }

  async fetchMessage(message: Message) {
    this.emit(Router.Event.MESSAGE_RECEIVED, message._from.hubId + '.' + message._from.terminalId, message)
    // console.log(message._from.hubId, '-->', JSON.stringify(message.payload).slice(0, 80))

    try {
      await Handler.run(this.handlerList, message)
    } catch (error) {
      debug(`Error: ${error}`)
    }
    this.dispatchMessage(message)
  }

  registerHandler(handler: any) {
    const currentHandler = new Handler(handler, this)
    this.handlerList.push(currentHandler)
    return currentHandler
  }

  event(signal: any) {
    switch (signal.type) {
      case Router.Event.TERMINAL_JOINED:
        debug(`[terminal]${signal.hubId}-${signal.terminalId} joined`)
        if (signal.channelId) {
          const channel = this.channelMap[signal.channelId]
          if (channel) {
            debug(`[channel]${signal.hubId}-${signal.terminalId} join channel ${signal.channelId}`)
            channel.join(signal.hubId, signal.terminalId, signal.forced)

            const cacheMessages = channel.getCache(signal.hubId, signal.terminalId)
            cacheMessages.forEach(m => this.dispatchMessage(m))
          }
        }
        this.emit(Router.Event.TERMINAL_JOINED, signal.hubId + '.' + signal.terminalId, signal)
        break
      case Router.Event.TERMINAL_LEAVED:
        debug(`[terminal]${signal.hubId}-${signal.terminalId} leaved`)
        if (signal.channelId) {
          const channel = this.channelMap[signal.channelId]
          if (channel) {
            debug(`[channel]${signal.hubId}-${signal.terminalId} leave channel ${signal.channelId}`)
            channel.leave(signal.hubId, signal.terminalId)
          }
        }
        this.emit(Router.Event.TERMINAL_LEAVED, signal.hubId + '.' + signal.terminalId, signal)
        break
    }
  }
}
