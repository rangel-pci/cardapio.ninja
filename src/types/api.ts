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
    open_close: {
      open: number | null,
      close: number | null,
    }[],
    telephone?: string,
    whatsapp?: string,
  },
  modules?: {
    title?: string,
    text?: string,
    products_id?: number[],
  }[],
  notice?: string,
  minimum_order?: string,
  theme?: string,
}
type Text = {
  title?: string,
  description?: string,
}
type ApiResponseEstablishment = {
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
type Establishment = ApiResponseEstablishment & {
  store: Store,
  text: Text,
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
  data: ApiResponseEstablishment[]
}

export type {
  ResponseDefault,
  ResponseLogin,
  ResponseEstablishment,
  ApiResponseEstablishment,
  ResponsePaginated,
  ResponseProduct,
  Product,
  Establishment
}