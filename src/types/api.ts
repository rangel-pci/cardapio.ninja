type ResponsePaginated = {
  current_page: number,
  first_page_url: string,
  last_page_url: string,
  prev_page_url: string,
  nex_page_url: string,
  path: string,
  per_page: number,
  from: number,
  to: number,
  total: number,
}
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
type Establishment = {
  id: number,
  name: string,
  link_name: string,
  banner: string,
  category: number,
  created_at: string,
  updated_at: string,
  image: string,
  store: string,
  text: string,
  user_id: number,
}
type ResponseEstablishment = ResponsePaginated & {
  data: Establishment[]
}

export type {
  ResponseDefault,
  ResponseLogin,
  ResponseEstablishment,
  Establishment,
  ResponsePaginated
}