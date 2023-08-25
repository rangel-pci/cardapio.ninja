import type { AxiosError } from "axios"
import { ApiService } from "@/services/ApiService"
import type { DefaultServiceResponse } from "@/types/Api"

const tryToLogin = async (form: { email: string, password: string }): Promise<DefaultServiceResponse> => {
    return await ApiService.post('/auth/login', form)
    .then(res => {
        return { success: true, data: res.data }
    })
    .catch((error: AxiosError) => {
      return { error: error }
    })
}

const tryToRefreshToken = async (token: string): Promise<DefaultServiceResponse> => {
    return await ApiService.post('/auth/refresh', undefined, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
        return { success: true, data: res.data }
    })
    .catch((error: AxiosError) => {
        return { error: error }
    })
}

export {
    tryToLogin,
    tryToRefreshToken
}