import axios from 'axios'

const APP_API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT

const ApiService = axios.create({
    baseURL: APP_API_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

export {
    ApiService,
}