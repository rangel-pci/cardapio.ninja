type BannerSection = {
    name: string,
    image: File | null,
    banner: File | null,
}
type InformationSection = {
    notice: string,
    minimum_order: number,
    contact?: {
        address?: string,
        email?: string,
        open_close: {
            open: string,
            close: string,
        }[],
        telephone?: string,
        whtasapp?: string,
    }
}
type EstablishmentFormData = {
    image?: File,
    banner?: File,
    name: string,
    category: number,
    link_name: string,
    store: string,
    text: string,
}

export type {
    BannerSection,
    EstablishmentFormData,
    InformationSection,
}