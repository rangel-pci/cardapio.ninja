import { useFetch } from '#app';
type UseFetchType = typeof useFetch

const apiService: UseFetchType = (path, options = {}) => {
  const config = useRuntimeConfig()
  options.baseURL = config.public.apiUrl as string
  return useFetch(path, options)
}

export {
  apiService,
}