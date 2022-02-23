import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import { BootstrapVue } from 'bootstrap-vue'


import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)

import * as PIXI from 'pixi.js'
window.PIXI = PIXI
import 'pixi-layers'

console.log('main.ts')

// Install BootstrapVue
Vue.use(BootstrapVue)

import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

// This imports <b-modal> as well as the v-b-modal directive as a plugin:
import { ModalPlugin } from 'bootstrap-vue'
Vue.use(ModalPlugin)

// Vue Virtual Scroller
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//@ts-ignore
import VueVirtualScroller from 'vue-virtual-scroller'
Vue.use(VueVirtualScroller)

Vue.config.productionTip = false

// Vueを拡張しプロジェクト固有のメソッドを持たせる
Vue.prototype.$reload = function() {
  this.$router.go(0);
}

;(window as any).$vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
