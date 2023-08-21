import type { ResponseDefault } from "@/types/Api"
import type { AxiosError } from "axios"
import type { NotificationApiInjection } from "naive-ui/es/notification/src/NotificationProvider"

const ErrorHandler = (error: AxiosError, notificationApi?: NotificationApiInjection) => {
    const data = error.response?.data as ResponseDefault
    const errorMessages: string[] = []
    if(data.errors){
        Object.keys(data.errors).forEach((key) => {
            if(data.errors?.[key]){ errorMessages.push(data.errors[key][0])}
        }) 
    }else if(data.message){
       errorMessages.push(data.message)
    }

    errorMessages.forEach(msg => {
        notificationApi?.error({
            content: 'Erro',
            meta: msg,
        })
    })
    
    return errorMessages
}

export {
    ErrorHandler
}