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
