import type { FetchError } from 'ofetch'

const tryToCreateUser = async (form: { name: string, email: string, password: string }) => {
  const { data, error } = await apiService('/users', {
    method: 'POST',
    params: form
  })
  return {data, error}
}

const tryToGetLoggedUser = async (token: string | undefined) => {
  if(!token){ 
    const error = ref<FetchError<any>>({ message: '', name: 'MissingToken', data: { message: 'Token não informado'}})
    return { error, data: ref(null) }
  }
  const { data, error } = await apiService('/users/me', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  return {data, error}
}

const tryToUpdateProfile = async (token: string | undefined, form: { name: string, email: string, password: string | undefined }) => {
  if(!token){ 
    const error = ref<FetchError<any>>({ message: '', name: 'MissingToken', data: { message: 'Token não informado'}})
    return { error, data: ref(null) }
  }
  const { data, error } = await apiService('/users', {
    method: 'PUT',
    params: form,
    headers: {
      'Authorization': 'Bearer ' + token
    },
  })
  return {data, error}
}

export {
  tryToCreateUser,
  tryToGetLoggedUser,
  tryToUpdateProfile
}