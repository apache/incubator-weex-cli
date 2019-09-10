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
import { Commit } from 'vuex'
import * as types from '../mutation-types'

export interface State {
  connectUrl: string
  version: string
  bundles: string []
}

const state: State = {
  connectUrl: '',
  version: '-',
  bundles: []
}

const getters = {

}

const actions = {
  updateQRCode (context: { commit: Commit, state: State }, obj: {connectUrl: string, channelId: string}) {
    context.commit(types.UPDATE_QRCODE_URL, obj.connectUrl)
    context.commit(types.UPDATE_CHANNEL_ID, obj.channelId, { root: true })
  },
  cleanQRCode (context: { commit: Commit, state: State }) {
    context.commit(types.WS_DISCONNNECT)
  },
  updateVersion (context: { commit: Commit, state: State }, value: string) {
    context.commit(types.UPDATE_VERSION, value)
  },
  updateBundles (context: { commit: Commit, state: State }, value: string []) {
    context.commit(types.UPDATE_BUNDLES, value)
  }
}

const mutations = {
  [types.UPDATE_QRCODE_URL] (state: State, url: string) {
    state.connectUrl = url
  },
  [types.UPDATE_VERSION] (state: State, value: string) {
    state.version = value
  },
  [types.WS_DISCONNNECT] (state: State) {
    state.connectUrl = ''
    state.bundles = []
  },
  [types.UPDATE_BUNDLES] (state: State, value: string []) {
    state.bundles = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
