import Vue from 'vue'
import Vuex, { Commit, Dispatch } from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import home, { State as HomeState } from './modules/home'
import weex, { State as WeexState } from './modules/weex'
import analyze, { State as AnalyzeState } from './modules/analyze'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export interface GlobalState {
  webSocketHost: string
  channelId: string
  environmentSetting: boolean
  helpSetting: boolean
  bundleSetting: boolean
}

const state: GlobalState = {
  webSocketHost: location.host,
  // webSocketHost: '30.8.57.159:8089',
  channelId: '',
  environmentSetting: false,
  helpSetting: false,
  bundleSetting: false
}

const store = new Vuex.Store({
  modules: {
    home,
    weex,
    analyze
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
  module.hot.accept(['./modules/weex'], () => {
    const weexModule = require('./modules/weex').default
    store.hotUpdate({
      modules: {
        weexModule
      }
    })
  })
  module.hot.accept(['./modules/analyze'], () => {
    const analyzeModule = require('./modules/analyze').default
    store.hotUpdate({
      modules: {
        analyzeModule
      }
    })
  })
}

export default store

export interface State extends GlobalState {
  home: HomeState,
  weex: WeexState,
  analyze: AnalyzeState
}
