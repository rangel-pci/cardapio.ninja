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
      component: () => import('../views/app/account/HomeView.vue')
    },
    {
      path: '/app/minha-conta',
      name: 'my-account',
      meta: { requiresAuth: true, title: 'Minha conta' },
      component: () => import('../views/app/account/MyAccountView.vue')
    },
    {
      path: '/app/gerenciar/:id',
      name: 'manage-establishment',
      meta: { requiresAuth: true, title: 'Gerenciar cardápio' },
      component: () => import('../views/app/establishment/IndexView.vue')
    },
    {
      path: '/app/alterar-senha',
      name: 'recover-password',
      meta: { title: 'Recuperar senha' },
      component: () => import('../views/app/RecoverPasswordView.vue')
    },
    {
      path: '/:link_name',
      name: 'visit-page',
      component: () => import('../views/app/visitPage/IndexView.vue')
    },
    { path: '/:catchAll(.*)', redirect: { name: 'home' } },
  ]
})

router.beforeEach(navigationGuard)
export default router
