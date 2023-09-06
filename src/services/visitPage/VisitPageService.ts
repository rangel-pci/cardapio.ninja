import type { AxiosError } from "axios"
import { ApiService } from "@/services/ApiService"
import type { DefaultServiceResponse } from "@/types/Api"

const tryToFetchVisitPage = async (link_name: string): Promise<DefaultServiceResponse> => {
    return await ApiService.get('/page/' + link_name)
    .then(res => {
        return { success: true, data: res.data }
    })
    .catch((error: AxiosError) => {
        return { error: error }
    })
}

export {
    tryToFetchVisitPage
}