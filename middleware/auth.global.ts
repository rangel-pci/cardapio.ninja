import type { RouteLocationNormalized } from "vue-router"
import { ResponseLogin } from "~/@types/api"

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const authStore = useAuthStore()
  const token = authStore.getToken()

  if(to.meta.requiresAuth){
    if(!token){return '/app/login'}
    const res = await tryToRefreshToken(token)
    if(res.error.value){
      authStore.setToken(undefined)
      return '/app/login'
    }else if(res.data.value){
      const data = res.data.value as ResponseLogin
      authStore.setToken(data.access_token)
    }
  }else{
    if((
        to.fullPath === '/app/login' || 
        to.fullPath === '/app/cadastro' ||
        to.fullPath === '/app/alterar-senha'
      ) && token){
      return '/app/minha-area'
    }
  }
})