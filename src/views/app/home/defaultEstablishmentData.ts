const defaultEstablishmentData = {
    store: JSON.stringify({
        "contact": {
            "telephone": "(00) 0000-0000",
            "whatsapp": "(00) 0000-0000",
            "address": "Seu endereço aqui",
            "email": "",
            "open_closed": "Aberto de segunda a sábado de 8h às 17h."
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
    image: undefined,
    banner: undefined,
}

export default defaultEstablishmentData;