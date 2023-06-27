type ResponsePaginated = {
  current_page: number,
  first_page_url: string,
  last_page_url: string,
  prev_page_url: string,
  next_page_url: string,
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
type Store = {
  contact?: {
    address?: string,
    email?: string,
    open_closed?: string,
    open?: number[],
    close?: number[],
    telephone?: string,
    whtasapp?: string,
  },
  modules?: {
    title?: string,
    text?: string,
    products_id?: number[],
  }[],
  theme?: string,
}
type Text = {
  title?: string,
  description?: string,
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
  store: Store,
  text: Text,
  user_id: number,
}
type Product = {
  id: number,
  name: string,
  image: string,
  created_at: string,
  updated_at: string,
  description: string,
  establishment_id: number,
  price_small: number,
  price_medium: number,
  price_big: number,
}
type ResponseProduct = ResponsePaginated & {
  data: Product[]
}
type ResponseEstablishment = ResponsePaginated & {
  data: Establishment[]
}

export type {
  ResponseDefault,
  ResponseLogin,
  ResponseEstablishment,
  Establishment,
  ResponsePaginated,
  ResponseProduct,
  Product
}