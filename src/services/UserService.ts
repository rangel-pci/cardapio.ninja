import type { AxiosError } from "axios"
import { ApiService } from "@/services/ApiService"
import type { DefaultServiceResponse } from "@/types/Api"

const tryToCreateUser = async (form: { name: string, email: string, password: string }): Promise<DefaultServiceResponse> => {
    return await ApiService.post('/users', form)
    .then(res => {
        return { success: true, data: res.data }
    })
    .catch((error: AxiosError) => {
      return { error: error }
    })
}

const tryToGetLoggedProfile = async (token: string | undefined): Promise<DefaultServiceResponse> => {
    if(!token){ return {success: false, data: { message: 'Token não informado'}} }
    return await ApiService.get('/users/me', { headers: { Authorization: `Bearer ${token}`, "Content-Type": 'multipart/form-data' } })
    .then(res => {
        return { success: true, data: res.data }
    })
    .catch((error: AxiosError) => {
      return { error: error }
    })
}

const tryToUpdateProfile = async (token: string | undefined, form: { name: string, email: string, password: string | undefined }): Promise<DefaultServiceResponse> => {
    if(!token){ return {success: false, data: { message: 'Token não informado'}} }
    return await ApiService.put('/users', form, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
        return { success: true, data: res.data }
    })
    .catch((error: AxiosError) => {
      return { error: error }
    })
}

export {
    tryToCreateUser,
    tryToGetLoggedProfile,
    tryToUpdateProfile
}