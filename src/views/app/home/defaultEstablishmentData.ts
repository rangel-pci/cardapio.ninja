import { ApiService } from "@/services/ApiService"

const defaultEstablishmentData = {
    store: JSON.stringify({
        "contact": {
            "telephone": "(00) 0000-0000",
            "whatsapp": "(00) 0000-0000",
            "address": "Seu endereço aqui",
            "email": "",
            "open_closed": "Aberto de segunda a sábado de 8h às 17h.",
            "open_close": [
                {open: '', close: ''},
                {open: '8:0', close: '23:59'},
                {open: '8:0', close: '23:59'},
                {open: '8:0', close: '23:59'},
                {open: '8:0', close: '23:59'},
                {open: '8:0', close: '23:59'},
                {open: '8:30', close: '12:30'},
            ],
        },
        "theme": "#9E6A1A",
        "modules": [
            {
                "title": "Título do Módulo",
                "text": "Descrição. . .",
                "products_id": []
            }
        ]
    }),
    text: JSON.stringify({ 
        "title": "Um Título", 
        "description": "Um pequeno texto, descrição, aviso, ou qualquer outra coisa." 
    }),
    image: <File | undefined>undefined,
    banner: <File | undefined>undefined,
}

async function getDefaultEstablishmentData(){
    const banner = await fetch('/static/default-establishment-banner.jpg')
    const image = await fetch('/static/default-establishment-image.jpg')
    const bannerBlob = await banner.blob()
    const imageBlob = await image.blob()
    defaultEstablishmentData.banner = new File([bannerBlob], 'default-establishment-banner.jpg')
    defaultEstablishmentData.image = new File([imageBlob], 'default-establishment-image.jpg')

    return defaultEstablishmentData
}

export default getDefaultEstablishmentData;