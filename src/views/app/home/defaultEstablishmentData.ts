const defaultEstablishmentData = {
    store: JSON.stringify({
        "contact": {
            "telephone": "(61) 99999-9999",
            "whatsapp": "(61) 99999-9999",
            "address": "Rua 00, Quadra 00, Lote 00, Bairro, Cidade - UF",
            "email": "",
            "open_closed": "",
            "open_close": [
                {open: '', close: ''},
                {open: '08:00', close: '23:59'},
                {open: '08:00', close: '23:59'},
                {open: '08:00', close: '23:59'},
                {open: '08:00', close: '23:59'},
                {open: '08:00', close: '23:59'},
                {open: '08:00', close: '23:59'},
            ],
        },
        "notice": "Caro cliente, favor avisar caso precise de troco para pagamento em dinheiro.",
        "minimum_order": "R$ 0,00",
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