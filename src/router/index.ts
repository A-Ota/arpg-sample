import Vue from 'vue'
import VueRouter, { RouterOptions } from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/mikan',
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
  {
    path: '/stages/006',
    component: () => import('../stages/006/View.vue')
  },
  {
    path: '/stages/007',
    component: () => import('../stages/007/View.vue')
  },
  {
    path: '/stages/008',
    component: () => import('../stages/008/View.vue')
  },
  {
    path: '/stages/009',
    component: () => import('../stages/009/View.vue')
  },
  {
    path: '/stages/010',
    component: () => import('../stages/010/View.vue')
  },
  {
    path: '/stages/011',
    component: () => import('../stages/011/View.vue')
  },
  {
    path: '/stages/012',
    component: () => import('../stages/012/View.vue')
  },
  {
    path: '/stages/013',
    component: () => import('../stages/013/View.vue')
  },
  {
    path: '/stages/014',
    component: () => import('../stages/014/View.vue')
  },
  {
    path: '/stages/015',
    component: () => import('../stages/015/View.vue')
  },
  {
    path: '/stages/016',
    component: () => import('../stages/016/AppView.vue'),
    redirect: '/stages/016/title',
    children: [
      {
        path: 'title',
        component: () => import('../stages/016/TitleView.vue')
      },
      {
        path: 'home',
        component: () => import('../stages/016/HomeView.vue')
      }
    ]
  },
  {
    path: '/stages/999',
    component: () => import('../stages/999/View.vue')
  },
  {
    path: '/stages/998',
    component: () => import('../stages/998/View.vue')
  },
  {
    path: '/stages/997',
    component: () => import('../stages/997/View.vue')
  },
  {
    path: '/game/01',
    component: () => import('../game/01/View.vue')
  },
  {
    path: '/game/02',
    component: () => import('../game/02/View.vue')
  },
  {
    path: '/mikan',
    component: () => import('../mikan/View.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
