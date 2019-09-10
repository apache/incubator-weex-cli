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
declare enum CHANNEL_MODE {
  P2P = 0,
  P2P_STRICT = 1,
  N2N = 2,
}

declare module '@weex-cli/linker' {
  interface FromType {
    hubId: string
    terminalId: string
  }

  interface ToType {
    hubId: string
    terminalId: string
  }

  export class Message {
    private uuid
    private id
    private _discard
    private _destroy
    private _destination
    constructor(payload: any, hubId: any, terminalId: string, channelId?: string)
    channelId: string
    terminalId: string
    routed: boolean
    createTime: Date
    payload: any
    _from: FromType
    _to: ToType[]
    destination(): any[]
    reply(): void
    match(name: string): boolean
    to(hubId: string, terminalId?: string): void
    discard(): void
    isAlive(): boolean
    route(resolver?: any): void
    selectOne(to: ToType): Message | void
  }

  export class Channel {
    private hubMap: {
      [key: string]: string[]
    }
    private mode: any
    private cache: any[]
    private enableMulticast: boolean
    public id: string
    constructor(channelId?: string | number, mode?: any, enableMulticast?: boolean)
    getTerminal(hubId: string): any
    findAll(): {
      [key: string]: string[]
    }
    findOthers(hubId: string, terminalId: string, toHubId: string): any[]
    pushCache(message: Message): Message[]
    getCache(hubId: string): Message[]
    has(hubId: string, terminalId: string): boolean
    join(hubId: string, terminalId?: string): any
    leave(hubId: string, terminalId: string): any
  }

  export class Emitter {
    private eventHandler: any
    private _broadcast(target: any, context: any, data: any): void
    private _emit(prevTarget: any, namespace: string, context: any, data: any): boolean
    on(event: string | number, namespace: any, handler?: any): void
    off(event: string, namespace: string): void
    emit(event: string, namespace: string, data: any): boolean
    broadcast(event: any, namespace: string, data: any): boolean
  }

  export class Filter {
    private condition: any
    handler: any
    static resolveFilterChain(message: Message, filterChain: any[], currentIndex: number): Promise<any>
    constructor(handler: any, condition?: any)
    when(condition: any): void
    run(message: Message): void
  }
  export class Hub {
    private terminalMap: any
    private filterChain: any[]
    private _pushToRouter: any
    id: string
    router: Router
    constructor(id: string)
    static get(id: string): Hub
    static check(): void
    join(terminal: any, forced?: boolean): void
    setChannel(terminalId: string, channelId: string): void
    setupTerminal(terminal: any, forced: boolean): void
    broadcast(message: Message): void
    pushToTerminal(terminalId: string, message: Message): void
    send(message: Message): void
    filter(filter: any, condition: any): void
  }

  export class Router extends Emitter {
    private channelMap: any
    private handlerList: any
    id: string
    hubs: any
    static check(): void
    static get(id: string): Router
    static dump(): void
    static Event: {
      TERMINAL_JOINED: 0
      TERMINAL_LEAVED: 1
      MESSAGE_RECEIVED: 2
    }
    static HubId: string
    constructor(id: string)
    private _pushMessage(message: Message): void
    link(hub: Hub): void
    reply(message: Message, payload: any): void
    newChannel(channelId: string, mode?: CHANNEL_MODE): string
    pushMessageByChannelId(hubId: string, channelId: string, payload: any): Promise<any>
    pushMessage(hubId: any, terminalId: any, payload?: any): void
    dispatchMessage(message: Message): void
    fetchMessage(message: Message): void
    registerHandler(handler: any): any
    event(signal: any): void
  }

  export class Handler {
    private handler: any
    private router: Router
    private fromString: string
    private condition: any
    static run(handlerList: any[], message: Message, i?: number): Promise<any>
    constructor(handler: any, router: Router)
    at(fromString: string): Handler
    when(condition: any): Handler
    test(message: Message): boolean
    run(message: Message): any
  }

  export namespace Terminal {
    export class SyncTerminal {
      private promise: any
      private resolve: any
      private syncId: string
      channelId: string
      id: string
      send(data: any): Promise<any>
      read(message: any): void
    }

    export class WebsocketTerminal {
      constructor (websocket:any, channelId?: string)
      private websocket: any
      channelId: string
      id: string
      read(message: any): void
    }
  }
}
