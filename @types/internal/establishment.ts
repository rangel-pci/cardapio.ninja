type EstablishmentFormData = {
  image?: File,
  banner?: File,
  name: string,
  category: number,
  link_name: string,
  store: string,
  text: string,
  [key: string]: any,
}

type BannerSection = {
  name: string,
  image: File | null,
  banner: File | null,
}

type InformationSection = {
  notice: string,
  minimum_order: string,
  contact: {
    address?: string,
    email?: string,
    open_close: {
      open: number | null,
      close: number | null,
    }[],
    telephone?: string,
    whatsapp?: string,
  },
}

export type {
  EstablishmentFormData,
  BannerSection,
  InformationSection
}