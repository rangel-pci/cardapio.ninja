<script setup lang="ts">
import type { ResponseLogin } from '@/@types/api';

useHead({
  titleTemplate: (titleChunk: string | undefined) => {
    return titleChunk ? `${titleChunk} - Login` : 'Login';
  }
})
const router = useRouter()
const form = reactive({
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
  const res = await tryToLogin(form)
  loading.finish()
  isLoading.value = false
  if (res.error.value) {
    loading.error()
    isLoading.value = false
    errorHandler(res.error, notification)
  } else if(res.data.value) {
    const data = res.data.value as ResponseLogin
    authStore.setToken(data.access_token)
    notification.destroyAll()
    router.push({ path: '/app/minha-area' })
  }
  loading.finish()
  isLoading.value = false
}
</script>

<template>
  <div class="bg-gray-200 min-h-screen flex flex-col justify-center items-center px-4">
    <n-card title="Login" class="max-w-sm">
      <template #header-extra>
        <NuxtImg src="/img/logo/logo_1.svg" class="rounded" alt="logo'" width="50"/>
      </template>

      <form>
        <label for="email">Email</label>
        <n-input class="mb-3" id="email" type="text" placeholder="" v-model:value="form.email" />

        <label for="password">Senha</label>
        <n-input @keydown.enter="handleLogin" class="mb-3" id="password" type="password" show-password-on="click"
          placeholder="" v-model:value="form.password" />

        <div class="text-right">
          <NuxtLink :to="{ path: '/app/alterar-senha' }" class="text-green-600 underline">Esqueci minha senha
          </NuxtLink>
        </div>

        <div class="flex justify-center mt-2">
          <n-button type="primary" class="flex-1" @click="handleLogin" :loading="isLoading">Entrar</n-button>
        </div>
      </form>
    </n-card>

    <p class="mt-4">Ainda não tem uma conta? <NuxtLink :to="{ path: '/app/cadastro' }" class="text-green-600 underline">Cadastre-se</NuxtLink></p>
  </div>
</template>