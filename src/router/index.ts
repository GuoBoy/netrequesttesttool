import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/views/request-view/Index.vue'

const routes = [
  {
    path: '/',
    name: 'app',
    redirect: '/index'
  }, {
    path: '/index',
    component: Index
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
