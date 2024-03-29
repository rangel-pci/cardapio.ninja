import type { FetchError } from 'ofetch'

type ResponseLogin = {
  access_token: string,
  token_type: string,
  expires_in: number,
}

type ResponseDefault = {
  message: string | undefined,
  errors?: {
    [key: string]: string[]
  },
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

type Module = {
  order: number,
  title: string, 
  text?: string,
  products_id?: number[]
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
  modules?: Module[],
  notice?: string,
  minimum_order?: string,
  theme?: string,
}

type Text = {
  title?: string,
  description?: string,
}

type Establishment = ApiResponseEstablishment & {
  store: Store,
  text: Text,
}

type DefaultServiceResponse = {
  data: globalThis.Ref<{data: any}>;
  error: globalThis.Ref<FetchError<any> | null>;
}

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

type ResponseEstablishment = ResponsePaginated & {
  data: ApiResponseEstablishment[]
}

type ResponseProfile = {
  id: number,
  name: string,
  email: string,
  created_at: string,
  updated_at: string,
  plan_id: string,
}

type Product = {
  id: number,
  name: string,
  image: string,
  created_at?: string,
  updated_at?: string,
  description: string,
  establishment_id?: number,
  price_small?: number,
  price_medium?: number,
  price_big?: number,
}
type ResponseProduct = ResponsePaginated & {
  data: Product[]
}
type ResponseProductCreateUpdated = ResponsePaginated & {
  data: {
    product: Product,
  }
}

export type {
  ResponseLogin,
  ResponseDefault,
  Establishment,
  ApiResponseEstablishment,
  ResponseEstablishment,
  DefaultServiceResponse,
  ResponseProfile,
  Product,
  ResponseProduct,
  ResponseProductCreateUpdated,
  Module,
}