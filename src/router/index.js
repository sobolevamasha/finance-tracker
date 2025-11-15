import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/analytics',
    name: 'Analytics', 
    component: () => import('../views/Analytics.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router