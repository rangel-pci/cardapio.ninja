<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ApiService, ErrorHandler } from '@/services/ApiService'
import { useLoadingBar, useNotification } from 'naive-ui';
import type { AxiosError } from 'axios';
import type { ResponseLogin } from '@/types/api'
import { useAuthStore } from '@/stores/user';
import router from '@/router';

const account = reactive({
  email: '',
  password: ''
})
const loading = useLoadingBar()
const isLoading = ref(false)
const notification = useNotification()
const authStore = useAuthStore()

const handleLogin = async () => {
  loading.start()
  isLoading.value = true
  await ApiService.post('/auth/login', account)
  .then(res => {
    const data = res.data as ResponseLogin
    authStore.setToken(data.access_token)
    loading.finish()
    isLoading.value = false
    notification.destroyAll()
    router.push({ name: 'my-area' })
  })
  .catch((error: AxiosError) => {
    loading.error()
    isLoading.value = false
    ErrorHandler(error, (errorMessages: string[]) => {
        errorMessages.forEach(msg => {
            notification.error({
                content: 'Erro',
                meta: msg,
            })
        })
    })
    // const data = error.response?.data as ResponseDefault
    
    // notification.error({
    //   content: 'Erro',
    //   meta: data.message,
    // })
  })
}
</script>

<template>
  <div class="bg-gray-200 min-h-screen flex flex-col justify-center items-center px-4">
    <n-card title="Login" class="max-w-sm">
      <template #header-extra>
        <img src="@/assets/img/logo/logo_1.svg" class="rounded" alt="logo'" width="50">
      </template>

      <form>
        <label for="email">Email</label>
        <n-input
          class="mb-3"
          id="email"
          type="email"
          placeholder=""
          v-model:value="account.email"
        />

        <label for="password">Senha</label>
        <n-input
          class="mb-3"
          id="password"
          type="password"
          show-password-on="click"
          placeholder=""
          v-model:value="account.password"
        />
        
        <div class="flex justify-center mt-2">
          <n-button type="primary" class="flex-1" @click="handleLogin" :disabled="account.email.length === 0 || account.password.length === 0 || isLoading">Entrar</n-button>
        </div>
      </form>
    </n-card>

    <p class="mt-4">Ainda não tem uma conta? <RouterLink :to="{ name: 'register' }" class="text-green-600 underline">Cadastre-se</RouterLink></p>
  </div>
</template>