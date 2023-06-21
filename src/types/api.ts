type ResponseDefault = {
  message: string | undefined,
  errors?: {
    [key: string]: string[]
  },
}
type ResponseLogin = {
  access_token: string,
  token_type: string,
  expires_in: number,
}

export type {
  ResponseDefault,
  ResponseLogin
}