import type { FetchError } from 'ofetch'
import type { EstablishmentFormData } from '@/@types/internal/establishment'

const tryToFetchUserEstablishments = async (token: string | undefined, page: number) => {
  if(!token){ 
    const error = ref<FetchError<any>>({ message: '', name: 'MissingToken', data: { message: 'Token não informado'}})
    return { error, data: ref(null) }
  }
  const { data, error } = await apiService('/establishments/my?page=' + page, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
    }
  })
  return {data, error}
}

const tryToCreateEstablishment = async (token: string | undefined, establishment: EstablishmentFormData) => {
  if(!token){ 
    const error = ref<FetchError<any>>({ message: '', name: 'MissingToken', data: { message: 'Token não informado'}})
    return { error, data: ref(null) }
  }
  const formData = toFormData(establishment)
  const { data, error } = await apiService('/establishments', {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  })
  return {data, error}
}

const tryToSaveEstablishment = async (token: string | undefined, establishmentId: number, form: EstablishmentFormData,) => {
  if(!token){ 
    const error = ref<FetchError<any>>({ message: '', name: 'MissingToken', data: { message: 'Token não informado'}})
    return { error, data: ref(null) }
  }
  const formData = toFormData(form)
  const { data, error } = await apiService('/establishments/' + establishmentId, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  })
  return {data, error}
}

const tryToFetchEstablishment = async (token: string | undefined, establishmentId: number,) => {
  if(!token){ 
    const error = ref<FetchError<any>>({ message: '', name: 'MissingToken', data: { message: 'Token não informado'}})
    return { error, data: ref(null) }
  }
  const { data, error } = await apiService('/establishments/' + establishmentId, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
    }
  })
  return {data, error}
}

const tryToFetchEstablishmentProducts = async (token: string | undefined, establishmentId: number, page: number) => {
  if(!token){ 
    const error = ref<FetchError<any>>({ message: '', name: 'MissingToken', data: { message: 'Token não informado'}})
    return { error, data: ref(null) }
  }
  const { data, error } = await apiService('/establishments/' + establishmentId + '/products?page=' + page, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
    }
  })
  return {data, error}
}

const tryToFetchEstablishmentPage = async (link_name: string) => {
  const { data, error } = await apiService('/page/' + link_name, {
    method: 'GET',
  })
  return {data, error}
}

export {
  tryToFetchUserEstablishments,
  tryToCreateEstablishment,
  tryToSaveEstablishment,
  tryToFetchEstablishment,
  tryToFetchEstablishmentProducts,
  tryToFetchEstablishmentPage
}