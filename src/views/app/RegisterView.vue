<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useLoadingBar, useNotification } from 'naive-ui';
import { useAuthStore } from '@/stores/AuthStore';
import router from '@/router';
import type { ResponseLogin } from '@/types/Api';
import { tryToCreateUser } from '@/services/UserService';
import { tryToLogin } from '@/services/AuthService';
import { ErrorHandler } from '@/utils/ErrorHandler';

const account = reactive({
    name: '',
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
  try{
    const responseUser = await tryToCreateUser(account)
    if(responseUser.success){
      const responseLogin = await tryToLogin(account)
      if(responseLogin.success){
        const data = responseLogin.data as ResponseLogin
        authStore.setToken(data.access_token)
        notification.destroyAll()
        router.push({ name: 'my-area' })
      }else if(responseLogin.error){
        ErrorHandler(responseLogin.error, notification)
      }
    }else if(responseUser.error){
      ErrorHandler(responseUser.error, notification)
    }
  }finally{
    loading.finish()
    isLoading.value = false
  }
}
</script>

<template>
  <div class="bg-gray-200 min-h-screen flex flex-col justify-center items-center px-4">
    <n-card title="Cadastro" class="max-w-sm">
      <template #header-extra>
        <img src="@/assets/img/logo/logo_1.svg" class="rounded" alt="logo'" width="50">
      </template>

      <form>
        <label for="nome">Nome</label>
        <n-input
          class="mb-3"
          id="nome"
          type="text"
          placeholder=""
          v-model:value="account.name"
        />

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
          <n-button type="primary" class="flex-1" @click="handleLogin"
            :loading="isLoading" :disabled="account.name.length === 0 || account.email.length === 0 || account.password.length === 0 || isLoading"
          >Continuar</n-button>
        </div>
      </form>
    </n-card>

    <p class="mt-4">Já possui uma conta? <RouterLink :to="{ name: 'login' }" class="text-green-600 underline">Entrar</RouterLink></p>
  </div>
</template>@/types/API@/types/Api@/stores/AuthStore