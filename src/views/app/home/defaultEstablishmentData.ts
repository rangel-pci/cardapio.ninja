const defaultEstablishmentData = {
    store: JSON.stringify({
        "contact": {
            "telephone": "61111111111",
            "whatsapp": "61111111111",
            "address": "Seu endereço aqui",
            "email": "",
            "open_closed": "",
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
        "notice": "Caro cliente, favor avisar caso precise de troco para pagamento em dinheiro.",
        "minimum_order": 0,
        "theme": "#6C5CE7",
        "modules": [
            {
                "title": "Título do Módulo",
                "text": "Descrição. . .",
                "products_id": []
            }
        ]
    }),
    text: JSON.stringify({ 
        "title": "", 
        "description": "" 
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