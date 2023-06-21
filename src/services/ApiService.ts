import axios from 'axios'
import type { AxiosError } from 'axios'
import type { ResponseDefault } from '@/types/api';

const APP_API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT

const ApiService = axios.create({
    baseURL: APP_API_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

const ErrorHandler = (error: AxiosError, callBack: Function) => {
    const data = error.response?.data as ResponseDefault
    const errorMessages: string[] = []
    if(data.errors){
        Object.keys(data.errors).forEach((key) => {
            if(data.errors?.[key]){ errorMessages.push(data.errors[key][0])}
        })
        callBack(errorMessages)
    }else if(data.message){
        callBack([data.message])
    }
}

export {
    ApiService,
    ErrorHandler
}