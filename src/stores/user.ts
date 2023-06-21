import { ref, computed } from 'vue';
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | undefined>(getToken())
  
  function getToken() {
    const ls = localStorage.getItem('auth')
    if(ls){
      return JSON.parse(ls).token
    }
    return undefined
  }

  function setToken(_token: string | undefined) {
      token.value = _token
      localStorage.setItem('auth', JSON.stringify({ token: _token }))
  }

  return { token, setToken }
})