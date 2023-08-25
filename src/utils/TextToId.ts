const TextToId = (text: string) => {
    return text.toLowerCase().split(' ').join('').replace(/[^a-z0-9]/g, '')
}

export {
    TextToId,
}