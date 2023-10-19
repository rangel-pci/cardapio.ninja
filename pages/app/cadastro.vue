<script setup lang="ts">
import { ResponseLogin } from '@/@types/api';

useHead({
  titleTemplate: (titleChunk: string | undefined) => {
    return titleChunk ? `${titleChunk} - Cadastro` : 'Cadastro';
  }
})
const form = reactive({
  name: '',
  email: '',
  password: ''
})
const loading = useLoadingBar()
const isLoading = ref(false)
const notification = useNotification()
const authStore = useAuthStore()
const router = useRouter()

const handleSignUp = async () => {
  loading.start()
  isLoading.value = true
  
  const responseUser = await tryToCreateUser(form)
  if(responseUser.error.value){
    loading.error()
    isLoading.value = false
    errorHandler(responseUser.error, notification)
  }else if(responseUser.data.value){
    const responseLogin = await tryToLogin(form)
    if(responseLogin.error.value){
      errorHandler(responseLogin.error, notification)
      loading.error()
      isLoading.value = false
    }else if(responseLogin.data.value){
      const data = responseLogin.data.value as ResponseLogin
      authStore.setToken(data.access_token)
      notification.destroyAll()
      router.push({ path: '/app/minha-area' })
    }
  }
  loading.finish()
  isLoading.value = false
}
</script>

<template>
  <div class="bg-gray-200 min-h-screen flex flex-col justify-center items-center px-4">
    <n-card title="Cadastro" class="max-w-sm">
      <template #header-extra>
        <NuxtImg src="/img/logo/logo_1.svg" class="rounded" alt="logo'" width="50"/>
      </template>

      <form>
        <label for="nome">Nome</label>
        <n-input
          class="mb-3"
          id="nome"
          type="text"
          placeholder=""
          v-model:value="form.name"
        />

        <label for="email">Email</label>
        <n-input
          class="mb-3"
          id="email"
          type="text"
          placeholder=""
          v-model:value="form.email"
        />

        <label for="password">Senha</label>
        <n-input
          @keydown.enter="handleSignUp"
          class="mb-3"
          id="password"
          type="password"
          show-password-on="click"
          placeholder=""
          v-model:value="form.password"
        />
        
        <div class="flex justify-center mt-2">
          <n-button type="primary" class="flex-1" @click="handleSignUp"
            :loading="isLoading" :disabled="form.name.length === 0 || form.email.length === 0 || form.password.length === 0 || isLoading"
          >Continuar</n-button>
        </div>
      </form>
    </n-card>

    <p class="mt-4">Já possui uma conta? <NuxtLink :to="{ path: '/app/login' }" class="text-green-600 underline">Entrar</NuxtLink></p>
  </div>
</template>