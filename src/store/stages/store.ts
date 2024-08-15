import { STAGE_016_TRANSITION_STATE, SET_STAGE_016_TRANSITION_STATE } from './mutation-types'

export default {
  namespaced: true,
  state: {
    stage016TransitionState: {
      state: 0,
      resolve: null
    }
  },
  getters: {
    [STAGE_016_TRANSITION_STATE] (state: any): any {
      return state.stage016TransitionState
    },
  },
  mutations: {
    [SET_STAGE_016_TRANSITION_STATE] (state: any, payload: any): any {
      state.stage016TransitionState = payload
    }
  },
  actions: {
    [SET_STAGE_016_TRANSITION_STATE] ({ commit }: { commit: any }, payload: any): any {
      return new Promise((resolve) => {
        commit(SET_STAGE_016_TRANSITION_STATE, { state: payload, resolve })
      })
    }
  }
}
