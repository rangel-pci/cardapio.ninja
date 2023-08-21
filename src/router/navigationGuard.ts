import type { RouteLocationNormalized } from "vue-router";
import { useAuthStore } from '../stores/AuthStore';
import type { ResponseLogin } from "@/types/Api";
import { tryToRefreshToken } from "@/services/AuthService";

type RouteLocationNormalizedExtended = RouteLocationNormalized & {
    meta?: {
      requiresAuth?: boolean
    }
}

const navigationGuard = async (to: RouteLocationNormalizedExtended) => {
    to.meta?.title && (document.title = to.meta.title as string + ' - ' + import.meta.env.VITE_APP_NAME)

    const authStore = useAuthStore()
    if(to.meta?.requiresAuth) {
        if(!authStore.token){return { name: 'login' }}
        const res = await tryToRefreshToken(authStore.token)
        if(res.success){ 
            const data = res.data as ResponseLogin
            authStore.setToken(data.access_token)
        }else{
            authStore.setToken(undefined)
            return { name: 'login' }
        }
    }else{
        if(authStore.token) {
            return { name: 'my-area' }
        }
    }
}

export default navigationGuard