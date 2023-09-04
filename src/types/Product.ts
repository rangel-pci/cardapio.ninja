type ProductFormData = {
    image: File | Blob | null,
    dontReplaceImage: boolean,
    name: string,
    description: string,
    price_small: number,
    price_medium: number,
    price_big: number,
}

export type {
    ProductFormData,
}