import { defineStore } from 'pinia'
import nuxtStorage from 'nuxt-storage'

export const useAuthStore = defineStore('auth', () => {
  function getToken(): string | undefined {
    const ls = nuxtStorage.localStorage.getData('auth')
    if(ls){
      return JSON.parse(ls).token
    }
    return undefined
  }

  function setToken(_token: string | undefined) {
    nuxtStorage.localStorage.setData('auth', JSON.stringify({ token: _token }), 1, 'd')
  }

  function removeToken() {
    nuxtStorage.localStorage.removeItem('auth')
    setToken(undefined)
  }

  return { setToken, removeToken, getToken }
})