import Vue from 'vue'
import VueRouter, { RouterOptions } from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/list',
  },
  {
    path: '/list',
    component: () => import('../views/ListPage.vue')
  },
  {
    path: '/stages/001',
    component: () => import('../stages/001/View.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
