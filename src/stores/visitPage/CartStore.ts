import { defineStore } from 'pinia'
import type { Product } from '@/types/Api';
import { computed, ref } from 'vue';

type Size = 'small' | 'medium' | 'big'| null
interface CartItem {
  product: Product,
  quantity: number,
  size: Size,
  getUnitPrice: (size: Size, product: Product) => number,
  getTotalPrice: (size: Size, product: Product, quantity: number) => number,
}

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref<CartItem[]>([])
  
  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      console.log(item.size, item.product, item.quantity)
      return total + item.getTotalPrice(item.size, item.product, item.quantity)
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

  const removeProduct = (product: Product, quantity: number, size: Size) => {
    const item = cartItems.value.find(item => item.product.id === product.id && item.size === size)
    if(item){
      item.quantity -= quantity
    }
  }

  return { cartItems, addProduct, cartTotal, removeProduct}
})