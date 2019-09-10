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
import Vue from 'vue'
import Vuex, { Commit, Dispatch } from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import home, { State as HomeState } from './modules/home'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export interface GlobalState {}

const state: GlobalState = {}

const store = new Vuex.Store({
  modules: {
    home
  },
  state,
  actions,
  getters,
  mutations,
  strict: debug
})

if (module.hot) {
  module.hot.accept(['./modules/home'], () => {
    const homeModule = require('./modules/home').default
    store.hotUpdate({
      modules: {
        homeModule
      }
    })
  })
}

export default store

export interface State extends GlobalState {
  home: HomeState
}
