import type { AxiosError } from "axios"
import { ApiService } from "@/services/ApiService"
import type { DefaultServiceResponse } from "@/types/Api"

type EstablishmentForm = {
    category: number,
    name: string,
    link_name: string,
    store: string,
    text: string,
    image?: File,
    banner?: File,
}
const tryToCreateEstablishment = async (token: string | undefined, form: EstablishmentForm): Promise<DefaultServiceResponse> => {
    if(!token){ return {success: false, data: { message: 'Token não informado'}} }
    return await ApiService.post('/establishments', form, { headers: { Authorization: `Bearer ${token}`, "Content-Type": 'multipart/form-data' } })
    .then(res => {
        return { success: true, data: res.data }
    })
    .catch((error: AxiosError) => {
      return { error: error }
    })
}

const tryToFetchUserEstablishments = async (token: string | undefined, page: number): Promise<DefaultServiceResponse> => {
    if(!token){ return {success: false, data: { message: 'Token não informado'}} }
    return await ApiService.get('/establishments/my?page=' + page, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
        return { success: true, data: res.data }
    })
    .catch((error: AxiosError) => {
        return { error: error }
    })
}

const tryToSaveEstablishment = async (token: string | undefined, establishmentId: number, form: EstablishmentForm): Promise<DefaultServiceResponse> => {
    if(!token){ return {success: false, data: { message: 'Token não informado'}} }
    return await ApiService.post('/establishments/' + establishmentId, form, { headers: { Authorization: `Bearer ${token}`, "Content-Type": 'multipart/form-data' } })
    .then(res => {
        return { success: true, data: res.data }
    })
    .catch((error: AxiosError) => {
      return { error: error }
    })
}

const tryToFetchEstablishment = async (token: string | undefined, establishmentId: number): Promise<DefaultServiceResponse> => {
    if(!token){ return {success: false, data: { message: 'Token não informado'}} }
    return await ApiService.get('/establishments/' + establishmentId, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
        return { success: true, data: res.data }
    })
    .catch((error: AxiosError) => {
        return { error: error }
    })
}

const tryToFetchEstablishmentProducts = async (token: string | undefined, establishmentId: number, page: number): Promise<DefaultServiceResponse> => {
    if(!token){ return {success: false, data: { message: 'Token não informado'}} }
    return await ApiService.get('/establishments/' + establishmentId + '/products?page=' + page, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
        return { success: true, data: res.data }
    })
    .catch((error: AxiosError) => {
        return { error: error }
    })
}

export {
    tryToCreateEstablishment,
    tryToFetchUserEstablishments,
    tryToSaveEstablishment,
    tryToFetchEstablishment,
    tryToFetchEstablishmentProducts
}