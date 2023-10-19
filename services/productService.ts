import type { FetchError } from 'ofetch'
import type { ProductFormData } from "~/@types/internal/product"

const tryToCreateProduct = async (token: string | undefined, establishmentId: number, form: ProductFormData) => {
  if(!token){ 
    const error = ref<FetchError<any>>({ message: '', name: 'MissingToken', data: { message: 'Token não informado'}})
    return { error, data: ref(null) }
  }
  const formData = toFormData(form)
  const { data, error } = await apiService('/establishments/' + establishmentId + '/products', {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  })
  return {data, error}
}

const tryToSaveProduct = async (token: string | undefined, establishmentId: number, productId: number, form: ProductFormData) => {
  if(!token){ 
    const error = ref<FetchError<any>>({ message: '', name: 'MissingToken', data: { message: 'Token não informado'}})
    return { error, data: ref(null) }
  }
  const formData = toFormData(form)
  const { data, error } = await apiService('/establishments/' + establishmentId + '/products/' + productId, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  })
  return {data, error}
}

const tryToDeleteProduct = async (token: string | undefined, establishmentId: number, productId: number) => {
  if(!token){ 
    const error = ref<FetchError<any>>({ message: '', name: 'MissingToken', data: { message: 'Token não informado'}})
    return { error, data: ref(null) }
  }
  const { data, error } = await apiService('/establishments/' + establishmentId + '/products/' + productId, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  })
  return {data, error}
}

export {
  tryToCreateProduct,
  tryToSaveProduct,
  tryToDeleteProduct,
}