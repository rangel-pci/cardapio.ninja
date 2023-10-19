const tryToLogin = async (form: { email: string, password: string }) => {
  const { data, error } = await apiService('/auth/login', {
    method: 'POST',
    params: form
  })
  return {data, error}
}

const tryToSendRecoverPasswordToken = async (email: string) => {
  const { data, error } = await apiService('/password/email', {
    method: 'POST',
    params: { email}
  })
  return {data, error}
}

const tryToRecoverPassword = async (email: string, password: string, token: string) => {
  const { data, error } = await apiService('/password/reset', {
    method: 'POST',
    params: { email, password, token }
  })
  return {data, error}
}

const tryToRefreshToken = async (token: string) => {
  const { data, error } = await apiService('/auth/refresh', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token }
  })
  return {data, error}
}

export {
  tryToLogin,
  tryToSendRecoverPasswordToken,
  tryToRecoverPassword,
  tryToRefreshToken
}