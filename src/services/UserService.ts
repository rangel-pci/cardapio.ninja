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

export {
    tryToCreateUser
}