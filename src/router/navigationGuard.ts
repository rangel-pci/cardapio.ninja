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
    const authStore = useAuthStore()
    if(to.meta?.requiresAuth) {
        if(!authStore.token){return { name: 'login' }}
        const newToken = await refreshToken(authStore.token)
        authStore.setToken(newToken ? newToken as string : undefined)
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