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
