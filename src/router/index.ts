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
      meta: { title: 'Login' },
      component: () => import('../views/app/LoginView.vue')
    },
    {
      path: '/app/cadastro',
      name: 'register',
      meta: { title: 'Cadastro' },
      component: () => import('../views/app/RegisterView.vue')
    },
    {
      path: '/app/minha-area',
      name: 'my-area',
      meta: { requiresAuth: true, title: 'Meus cardápios' },
      component: () => import('../views/app/home/IndexView.vue')
    },
    {
      path: '/app/gerenciar/:id',
      name: 'manage-establishment',
      meta: { requiresAuth: true, title: 'Gerenciar Cardápio' },
      component: () => import('../views/app/establishment/IndexView.vue')
    },
    { path: '/:catchAll(.*)', redirect: { name: 'home' } },
  ]
})

router.beforeEach(navigationGuard)
export default router
