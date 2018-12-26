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
