const textToId = (text: string) => {
  return text.toLowerCase().split(' ').join('').replace(/[^a-z0-9]/g, '')
}

export {
  textToId,
}