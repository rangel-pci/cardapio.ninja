import { ref } from 'vue';
import { defineStore } from 'pinia'

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

  function removeToken() {
    localStorage.removeItem('auth')
    setToken(undefined)
  }

  return { token, setToken, removeToken }
})