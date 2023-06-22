import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/web/HomeView.vue'
import navigationGuard from './navigationGuard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/app/login',
      name: 'login',
      component: () => import('../views/app/LoginView.vue')
    },
    {
      path: '/app/cadastro',
      name: 'register',
      component: () => import('../views/app/RegisterView.vue')
    },
    {
      path: '/app/minha-area',
      name: 'my-area',
      meta: { requiresAuth: true },
      component: () => import('../views/app/home/HomeView.vue')
    },
    { path: '/:catchAll(.*)', redirect: { name: 'home' } },
  ]
})

router.beforeEach(navigationGuard)
export default router
