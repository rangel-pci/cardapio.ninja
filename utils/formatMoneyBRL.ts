const formatMoneyBRL = (valueInCents: number) => {
  if(valueInCents > 0){
    valueInCents = valueInCents / 100
  }
  return valueInCents.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
}

export {
  formatMoneyBRL
}