<script setup lang="ts">
import type { ResponseProfile } from '@/@types/api';

onMounted(() => {
  getProfile()
})

useHead({
  titleTemplate: (titleChunk: string | undefined) => {
    return titleChunk ? `${titleChunk} - Minha conta` : 'Minha conta';
  }
})
definePageMeta({
  requiresAuth: true
})
const loading = useLoadingBar()
const isLoading = ref(false)
const notification = useNotification()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: undefined,
})

const getProfile = async () => {
  loading.start()
  isLoading.value = true
  const res = await tryToGetLoggedUser(authStore.getToken())
  if(res.error.value){
    loading.error()
    errorHandler(res.error, notification)
  }else if(res.data.value){
    const apiRes = res.data.value as ResponseProfile
    form.name = apiRes.name
    form.email = apiRes.email
  }
  loading.finish()
  isLoading.value = false
}

const handleSubmit = async () => {
  loading.start()
  isLoading.value = true
  const res = await tryToUpdateProfile(authStore.getToken(), form)
  if(res.error.value){
    loading.error()
    errorHandler(res.error, notification)
  }else if(res.data.value){
    notification.success({title: 'Sucesso', description: 'Perfil atualizado com sucesso'})
  }
  loading.finish()
  isLoading.value = false
}
</script>

<template>
  <div>
    <AppHeader />
    <div class="bg-gray-200 min-h-screen flex flex-col px-4 items-center">
      <n-card title="Minha conta" class="max-w-sm mt-8">
        <form v-if="!isLoading">
          <label for="name">Nome</label>
          <n-input
            class="mb-3"
            id="name"
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
            @keydown.enter="handleSubmit"
            class="mb-3"
            id="password"
            type="password"
            show-password-on="click"
            placeholder=""
            v-model:value="form.password"
          />

          <div class="flex justify-center mt-2">
            <n-button type="primary" class="flex-1" @click="handleSubmit" :loading="isLoading">Salvar</n-button>
          </div>
        </form>

        <n-space v-else vertical>
          <n-skeleton class="mt-1" height="15px" width="20%" />
          <n-skeleton height="25px" width="100%" />
          <n-skeleton class="mt-1" height="15px" width="20%" />
          <n-skeleton height="25px" width="100%" />
          <n-skeleton class="mt-1" height="15px" width="20%" />
          <n-skeleton height="25px" width="100%" />
        </n-space>
      </n-card>
    </div>
  </div>
</template>