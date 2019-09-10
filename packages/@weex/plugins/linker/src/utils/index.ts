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
const getEventHanlderByNamespace = (hanlders:any, namespace: string, defaultValue: any = []) => {
  if (!namespace) {
    return hanlders
  }
  const props = namespace.split('.')
  let p = props.shift()
  let cur = hanlders
  while (p) {
    cur = cur[p]
    if (cur === undefined || cur === null) break
    p = props.shift()
  }
  return cur || defaultValue
}

const locateEventHanlderByNamespace = (hanlders:any, namespace:string) => {
  if (!namespace) {
    return hanlders
  }
  const props = namespace.split('.')
  let p = props.shift()
  let cur = hanlders
  while (p) {
    if (cur[p] === undefined) {
      cur[p] = {}
    }
    cur = cur[p]
    p = props.shift()
  }
  return cur
}

const clearEventHandlerByNamespace = (handlers:any, namespace:string) => {
  const props = namespace.split('.')
  let p = props.shift()
  let cur = handlers
  if (!namespace) {
    cur.__handlers__ = []
    return cur
  }
  while (p) {
    if (props.length === 0) {
      cur[p] = {}
    } else {
      cur = cur[p]
    }

    if (!cur) break
    p = props.shift()
  }
  return cur
}
const matchHubId = (base, target) => {
  return base === target || (target.indexOf(base) === 0 && target.charAt(base.length) === '.')
}

const containHubId = (data: { hubId: string; [key: string]: any }[], hubId: string) => {
  let len = data.length
  let result = false
  for (let i = 0; i < len; i++) {
    if (!data[i].hubId || matchHubId(data[i].hubId, hubId)) {
      result = true
    }
  }
  return result
}

const isAsyncFuction = (fn: any) => {
  return Object.prototype.toString.call(fn) === '[object AsyncFunction]'
}

export default {
  getEventHanlderByNamespace,
  locateEventHanlderByNamespace,
  clearEventHandlerByNamespace,
  matchHubId,
  containHubId,
  isAsyncFuction
}
