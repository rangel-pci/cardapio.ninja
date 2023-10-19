const toFormData = (obj: any) => {
  const formData  = new FormData()
  for(const name in obj) {
    if(obj[name] !== undefined){
      formData.append(name, obj[name])
    }
  }
  return formData
}

export {
  toFormData,
}