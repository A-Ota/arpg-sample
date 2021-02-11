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
    component: () => import('../stages/001/View.vue')
  },
  {
    path: '/stages/002',
    component: () => import('../stages/002/View.vue')
  },
  {
    path: '/stages/003',
    component: () => import('../stages/003/View.vue')
  },
  {
    path: '/stages/004',
    component: () => import('../stages/004/View.vue')
  },
  {
    path: '/stages/005',
    component: () => import('../stages/005/View.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
