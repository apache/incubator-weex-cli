import { Commit } from 'vuex'
import * as types from '../mutation-types'

export interface History {
  url: string
  times: number
  env: Environment
}

export interface Environment {
  jsframework: string
  workerjs: string
  jsservice: string
  dependenceurl: string
  sourcejs: string
}
export interface State {
  remoteDebugStatus: boolean
  networkStatus: boolean
  elementMode: string
  logLevel: string
  historys: History[]
  environment: Environment
}
const defaultEnvironment = {
  jsframework: '',
  workerjs: '',
  jsservice: '',
  dependenceurl: '',
  sourcejs: ''
}
const state: State = {
  remoteDebugStatus: false,
  networkStatus: false,
  elementMode: 'native',
  logLevel: 'debug',
  historys: [],
  environment: defaultEnvironment
}

const getters = {

}

const actions = {
  updateForm (context: { commit: Commit, state: State }, obj: {type: string, value: boolean | string}) {
    context.commit(obj.type, obj.value)
  },
  cleanHistorys (context: { commit: Commit, state: State }) {
    context.commit(types.CLEAN_INSTANCE_HISTORY)
  },
  updateEnvironment (context: { commit: Commit, state: State }, value: Environment) {
    context.commit(types.UPDATE_WEEX_ENVIRONMENT, value)
  },
  cleanEnvironment (context: { commit: Commit, state: State }) {
    context.commit(types.CLEAN_WEEX_ENVIRONMENT)
  }
}

const mutations = {
  [types.UPDATE_REMOTE_DEBUG_STATUS] (state: State, value: boolean) {
    state.remoteDebugStatus = value
  },
  [types.UPDATE_NETWORK_STATUS] (state: State, value: boolean) {
    state.networkStatus = value
  },
  [types.UPDATE_ELEMENT_MODE_STATUS] (state: State, value: string) {
    state.elementMode = value
  },
  [types.UPDATE_LOG_LEVEL_STATUS] (state: State, value: string) {
    state.logLevel = value
  },
  [types.UPDATE_INSTANCE_URL] (state: State, obj: {value: string, env: Environment}) {
    state.environment['sourcejs'] = obj.value
    let len = state.historys.length
    let exist = false
    for (let i = 0; i < len; i++) {
      if (state.historys[i].url === obj.value) {
        state.historys[i].times ++
        exist = true
        break
      }
    }
    if (!exist) {
      state.historys.push({
        url: obj.value,
        times: 1,
        env: obj.env
      })
    }
  },
  [types.CLEAN_INSTANCE_HISTORY] (state: State) {
    state.historys = []
  },
  [types.UPDATE_WEEX_ENVIRONMENT] (state: State, value: Environment) {
    state.environment = value
  },
  [types.CLEAN_WEEX_ENVIRONMENT] (state: State) {
    state.environment = defaultEnvironment
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
