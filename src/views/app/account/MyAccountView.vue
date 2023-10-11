<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useLoadingBar, useNotification } from 'naive-ui';
import type { ResponseProfile } from '@/types/Api';
import { useAuthStore } from '@/stores/AuthStore';
import Header from '@/components/app/HeaderComponent.vue'
import { ErrorHandler } from '@/utils/ErrorHandler';
import { tryToGetLoggedProfile, tryToUpdateProfile } from '@/services/UserService';

onMounted(() => {
  getProfile()
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
  const res = await tryToGetLoggedProfile(authStore.token)
  if(res.success){
    const apiRes = res.data as ResponseProfile
    form.name = apiRes.name
    form.email = apiRes.email
    loading.finish()
  }else if(res.error){
    loading.error()
    ErrorHandler(res.error, notification)
  }
  isLoading.value = false
}

const handleSubmit = async () => {
  loading.start()
  isLoading.value = true
  const res = await tryToUpdateProfile(authStore.token, form)
  if(res.success){
    loading.finish()
    isLoading.value = false
    notification.success({title: 'Sucesso', description: 'Perfil atualizado com sucesso'})
  }else if(res.error){
    loading.finish()
    isLoading.value = false
    ErrorHandler(res.error, notification)
  }
}
</script>

<template>
  <Header />
  <div class="bg-gray-200 min-h-screen flex flex-col px-4 items-center">
    <n-card title="Minha conta" class="max-w-sm mt-8">
      <form v-if="!isLoading">
        <label for="email">Nome</label>
        <n-input
          class="mb-3"
          id="email"
          type="email"
          placeholder=""
          v-model:value="form.name"
        />

        <label for="email">Email</label>
        <n-input
          class="mb-3"
          id="email"
          type="email"
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
</template>