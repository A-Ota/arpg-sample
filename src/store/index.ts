import Vue from 'vue'
import Vuex from 'vuex'
import TestStore from './test/store'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    test: TestStore,
  }
})
