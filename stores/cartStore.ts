import { defineStore } from 'pinia'
import type { Establishment, Product } from '@/@types/api';
import nuxtStorage from 'nuxt-storage'

type Size = 'small' | 'medium' | 'big'| null
interface CartItem {
  product: Product,
  quantity: number,
  size: Size,
  getUnitPrice: (size: Size, product: Product) => number,
  getTotalPrice: (size: Size, product: Product, quantity: number) => number,
}

interface DeliveryInfo {
  name: string,
  phone: string,
  cep: string,
  address: string,
  note: string,
  number: string | null,
}

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref<CartItem[]>([])
  const deliveryInfo = ref(getDeliveryInfo())
  
  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + item.getTotalPrice(item.size, item.product, item.quantity)
    }, 0)
  })

  const cartTotalItems = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + item.quantity
    }, 0)
  })
  
  const addProduct = (product: Product, quantity: number, size: Size) => {
    const item = cartItems.value.find(item => item.product.id === product.id && item.size === size)
    if(item){
      item.quantity += quantity
    }else{
      const item = {
        product: product,
        quantity: quantity,
        size: size,
        getUnitPrice: (size: Size, product: Product) => {
          if(size === 'small'){
            return product.price_small ?? 0
          }else if(size === 'medium'){
            return product.price_medium ?? 0
          }else if(size === 'big'){
            return product.price_big ?? 0
          }else{
            return product.price_small ?? 0
          }
        },
        getTotalPrice: (size: Size, product: Product, quantity: number) => {
          if(size === 'small'){
            return (product.price_small! * quantity) ?? 0
          }else if(size === 'medium'){
            return (product.price_medium! * quantity) ?? 0
          }else if(size === 'big'){
            return (product.price_big! * quantity) ?? 0
          }else{
            return (product.price_small! * quantity) ?? 0
          }
        },
      }
      cartItems.value.push(item)
    }
  }

  const removeProduct = (product: Product, size: Size) => {
    cartItems.value = cartItems.value.filter(item => {
      if(item.product.id === product.id){
        if(item.size === size){
          return false
        }else{
          return true
        }
      }
      return true
    })
  }

  function getDeliveryInfo(): DeliveryInfo {
    const info = nuxtStorage.localStorage.getData('deliveryInfo')
    if(info){
      return JSON.parse(info)
    }

    return {
      name: '',
      phone: '',
      address: '',
      cep: '',
      number: null,
      note: '',
    }
  }

  const saveDeliveryInfo = (info: DeliveryInfo) => {
    deliveryInfo.value = info
    nuxtStorage.localStorage.setData('deliveryInfo', JSON.stringify(info), 360, 'd')
  }

  const mountWhatsAppOrder = (establishment: Establishment): string => {
    let items = ''
    const getSize = (size: Size) => {
      if(size === 'small'){
        return 'Pequeno'
      }else if(size === 'medium'){
        return 'Médio'
      }else if(size === 'big'){
        return 'Grande'
      }else{
        return 'Único'
      }
    }
    cartItems.value.forEach(item => {
      items += 
`\n*${item.quantity}x${getSize(item.size)}* - ${item.product.name}
*Valor*: ${formatMoneyBRL(item.getTotalPrice(item.size, item.product, item.quantity))}`
    })

    const message = `
🏷️ *Novo pedido via ${import.meta.env.VITE_APP_NAME_NORMALIZED}*
Página: _*${establishment.name}*_
-------------------------------
🛍 *Produtos:*
${items}
-------------------------------
💰 *Total:* ${formatMoneyBRL(cartTotal.value)}
-------------------------------
🧑 *Cliente:* ${deliveryInfo.value.name}
-------------------------------
📞 *Telefone:* ${deliveryInfo.value.phone}
-------------------------------
🚚 *Endereço:* ${deliveryInfo.value.address}, Nº ${deliveryInfo.value.number}, ${deliveryInfo.value.cep}
-------------------------------
📝 *Observação:* ${deliveryInfo.value.note}
-------------------------------
🕒 _*Aguardando confirmação do estabelecimento*_
${new Date().toLocaleDateString()}
`
    return message
  }

  return { cartItems, addProduct, cartTotal, cartTotalItems, removeProduct, deliveryInfo, saveDeliveryInfo, mountWhatsAppOrder}
})