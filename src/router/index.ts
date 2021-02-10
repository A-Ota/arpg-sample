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
  // 初回ツイートで/topにしてしまったばっかりに・・
  {
    path: '/top',
    redirect: '/stages/001',
  },
  {
    path: '/stages/001',
    component: () => import('../views/stages/Stage001.vue')
  },
  {
    path: '/stages/002',
    component: () => import('../views/stages/Stage002.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
