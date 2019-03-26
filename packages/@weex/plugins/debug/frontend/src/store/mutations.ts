import { Commit, MutationTree } from 'vuex'

import * as types from './mutation-types'
import { State } from './index'

const mutations: MutationTree<State> = {
  [types.UPDATE_CHANNEL_ID] (state: State, value: string) {
    state.channelId = value
  },
  [types.UPDATE_ENVIRONMENT_SETTING] (state: State, value: boolean) {
    state.environmentSetting = value
  },
  [types.UPDATE_HELP_SETTING] (state: State, value: boolean) {
    state.helpSetting = value
  },
  [types.UPDATE_BUNDLE_SETTING] (state: State, value: boolean) {
    state.bundleSetting = value
  }
}

export default mutations
