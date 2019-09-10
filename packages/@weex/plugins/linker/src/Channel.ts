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
import * as uuid from 'uuid'
import utils from './utils'
import Message from './Message'
import * as DEBUG from 'debug'
const debug = DEBUG('channel')

export enum CHANNEL_MODE {
  P2P = 0,
  P2P_STRICT = 1,
  N2N = 2,
}

export default class Channel {
  private hubMap: {
    [key: string]: string[]
  } = {}
  private mode: any
  private cache: any[] = []
  private enableMulticast: boolean = false
  public id: string

  constructor(channelId?: string | number, mode?: any, enableMulticast?: boolean) {
    this.mode = mode || CHANNEL_MODE.N2N
    this.id = channelId || uuid()
    this.enableMulticast = enableMulticast || false
  }

  getTerminal(hubId: string) {
    return this.hubMap[hubId]
  }

  findAll() {
    return Object.keys(this.hubMap).map(hid => ({
      hubId: hid,
      terminalId: this.hubMap[hid],
    }))
  }

  findOthers(hubId: string, terminalId: string, toHubId: string) {
    if (hubId === toHubId) {
      debug('Hubid must be different from toHubId')
      throw new Error('Hubid must be different from toHubId')
    } else if (!this.has(hubId, terminalId) && !toHubId) {
      debug(`Terminal [ ${hubId}.${terminalId || '*'}]  is not in this chanel`)
      throw new Error(`Terminal [ ${hubId}.${terminalId || '*'}]  is not in this chanel`)
    } else {
      const keys = Object.keys(this.hubMap)
      if (keys.length > 2 && !this.enableMulticast && !toHubId) {
        return []
      }
      return keys
        .filter(hid => hid !== hubId && (!toHubId || utils.matchHubId(toHubId, hid)))
        .map(hid => ({ hubId: hid, terminalId: this.hubMap[hid] }))
    }
  }

  pushCache(message: Message) {
    this.cache.push(message)
    return this.cache
  }

  getCache(hubId: string) {
    const hit = []
    const notHit = []
    this.cache.forEach(cacheMessage => {
      if (cacheMessage._to.length > 0) {
        if (cacheMessage._from.hubId !== hubId && utils.containHubId(cacheMessage._to, hubId)) {
          hit.push(cacheMessage)
        } else {
          notHit.push(cacheMessage)
        }
      }
    })
    if (hit.length > 0) {
      this.cache = notHit
    }
    return hit
  }

  has(hubId, terminalId) {
    return this.hubMap[hubId] && (!terminalId || this.hubMap[hubId].indexOf(terminalId) >= 0)
  }

  join(hubId: string, terminalId?: string) {
    if (this.hubMap[hubId]) {
      if (this.hubMap[hubId].indexOf(terminalId) === -1) {
        this.hubMap[hubId].push(terminalId)
      } else {
        this.hubMap[hubId] = [terminalId]
      }
    } else {
      const hubIds = Object.keys(this.hubMap)
      if (this.mode === CHANNEL_MODE.P2P && hubIds.length >= 2) {
        throw new Error('A channel can just link two hub in p2p mode')
      }
      this.hubMap[hubId] = [terminalId]
    }
    return this.hubMap[hubId]
  }

  leave(hubId, terminalId) {
    if (this.has(hubId, terminalId) && Array.isArray(this.hubMap[hubId])) {
      this.cache = this.cache.filter(
        cacheMessage => cacheMessage.hubId !== hubId || (terminalId && cacheMessage.terminalId !== terminalId),
      )
      let index = this.hubMap[hubId].indexOf(terminalId)
      if (index >= 0) {
        this.hubMap[hubId].splice(index, 1)
      }
    }
    return this.hubMap[hubId]
  }
}
