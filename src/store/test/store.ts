import { SEND_TEST, TEST_STATE } from './mutation-types'

export default {
  namespaced: true,
  state: {
    testState: 0
  },
  getters: {
    [TEST_STATE](state: any): any {
      return state.testState
    }
  },
  mutations: {
    [SEND_TEST](state: any) {
      state.testState = 1
    }
  },
  actions: {
  }
}
