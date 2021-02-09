import { SEND_TEST } from './mutation-types'

export default {
  namespaced: true,
  state: {
    testState: 0
  },
  getters: {
  },
  mutations: {
    [SEND_TEST](state: any) {
      state.testState = 1
    }
  },
  actions: {
  }
}
