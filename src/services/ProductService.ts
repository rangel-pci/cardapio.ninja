import type { DefaultServiceResponse } from "@/types/Api";
import type { ProductFormData } from "@/types/Product";
import { ApiService } from "./ApiService";
import type { AxiosError } from "axios";

const tryToCreateProduct = async (token: string | undefined, establishmentId: number, form: ProductFormData): Promise<DefaultServiceResponse> => {
    if(!token){ return {success: false, data: { message: 'Token não informado'}} }
    return await ApiService.post('/establishments/' + establishmentId + '/products', form, { headers: { Authorization: `Bearer ${token}`, "Content-Type": 'multipart/form-data' } })
    .then(res => {
        return { success: true, data: res.data }
    })
    .catch((error: AxiosError) => {
      return { error: error }
    })
}

const tryToSaveProduct = async (token: string | undefined, establishmentId: number, productId: number, form: ProductFormData): Promise<DefaultServiceResponse> => {
    if(!token){ return {success: false, data: { message: 'Token não informado'}} }
    return await ApiService.put('/establishments/' + establishmentId + '/products/' + productId, form, { headers: { Authorization: `Bearer ${token}`, "Content-Type": 'multipart/form-data' } })
    .then(res => {
        return { success: true, data: res.data }
    })
    .catch((error: AxiosError) => {
      return { error: error }
    })
}

export {
    tryToCreateProduct,
    tryToSaveProduct
}