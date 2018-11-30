import { Commit } from 'vuex'
import * as types from '../mutation-types'

export interface State {
  connectUrl: string,
  version: string
}

const state: State = {
  connectUrl: '',
  version: '-'
}

const getters = {

}

const actions = {

}

const mutations = {

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
