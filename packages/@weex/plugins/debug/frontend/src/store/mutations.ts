import { Commit, MutationTree } from 'vuex'

import * as types from './mutation-types'
import { State } from './index'

const mutations: MutationTree<State> = {
  [types.UPDATE_CHANNEL_ID] (state: State, value: string) {
    state.channelId = value
  },
  [types.UPDATE_ENVIRONMENT_SETTING] (state: State, value: string) {
    state.environmentSetting = value
  },
  [types.UPDATE_HELP_SETTING] (state: State, value: string) {
    state.helpSetting = value
  }
}

export default mutations
