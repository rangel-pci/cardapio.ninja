<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useLoadingBar, useNotification } from 'naive-ui';
import type { ResponseLogin } from '@/types/Api'
import { useAuthStore } from '@/stores/AuthStore';
import router from '@/router';
import { tryToLogin } from '@/services/AuthService';
import { ErrorHandler } from '@/utils/ErrorHandler'

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
  const res = await tryToLogin(account)
  loading.finish()
  isLoading.value = false
  if(res.success){
    const data = res.data as ResponseLogin
    authStore.setToken(data.access_token)
    notification.destroyAll()
    router.push({ name: 'my-area' })
  }else if(res.error){
    ErrorHandler(res.error, notification)
  }
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
          @keydown.enter="handleLogin"
          class="mb-3"
          id="password"
          type="password"
          show-password-on="click"
          placeholder=""
          v-model:value="account.password"
        />
        
        <div class="flex justify-center mt-2">
          <n-button type="primary" class="flex-1" @click="handleLogin" :loading="isLoading">Entrar</n-button>
        </div>
      </form>
    </n-card>

    <p class="mt-4">Ainda não tem uma conta? <RouterLink :to="{ name: 'register' }" class="text-green-600 underline">Cadastre-se</RouterLink></p>
  </div>
</template>@/stores/AuthStore