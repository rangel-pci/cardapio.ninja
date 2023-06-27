import type { RouteLocationNormalized } from "vue-router";
import { useAuthStore } from '../stores/user';
import { ApiService } from "@/services/ApiService";
import type { ResponseLogin } from "@/types/api";
import type { AxiosError } from "axios";

type RouteLocationNormalizedExtended = RouteLocationNormalized & {
    meta?: {
      requiresAuth?: boolean
    }
}

const navigationGuard = async (to: RouteLocationNormalizedExtended) => {
    to.meta?.title && (document.title = to.meta.title as string + ' - ' + document.title)

    const authStore = useAuthStore()
    if(to.meta?.requiresAuth) {
        if(!authStore.token){return { name: 'login' }}
        const newToken = await refreshToken(authStore.token)
        if(newToken){ 
            authStore.setToken(newToken as string)
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

const refreshToken = async (token: string) => {
    return await ApiService.post('/auth/refresh', null, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
        const data = res.data as ResponseLogin
        return data.access_token
    })
    .catch((error: AxiosError) => {
        console.log(error)
        return false
    })
}

export default navigationGuard