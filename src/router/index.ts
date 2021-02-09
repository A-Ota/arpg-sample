import Vue from 'vue'
import VueRouter, { RouterOptions } from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/top',
  },
  {
    path: '/top',
    component: () => import('../views/TopPage.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
