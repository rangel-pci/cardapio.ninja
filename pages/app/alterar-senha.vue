<script setup lang="ts">

const token = useRoute().query.token as string ?? null
const title = token ? 'Alterar Senha' : 'Recuperar Senha'
useHead({
  titleTemplate: (titleChunk: string | undefined) => {
    return titleChunk ? `${titleChunk} - Cadastro` : 'Cadastro';
  }
})
const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})
const loading = useLoadingBar()
const isLoading = ref(false)
const notification = useNotification()
const router = useRouter()

const handleSubmit = async () => {
  loading.start()
  isLoading.value = true
  if(!token){
    const res = await tryToSendRecoverPasswordToken(form.email)
    if(res.error.value){
      loading.error()
      isLoading.value = false
      errorHandler(res.error, notification)
    }else if(res.data.value){
      notification.success({
        title: 'Sucesso',
        description: 'Enviamos um email com um link para alterar sua senha'
      })
    }
    loading.finish()
    isLoading.value = false
  }else{
    if(form.password !== form.confirmPassword){
      alert('As senhas não conferem')
      loading.finish()
      isLoading.value = false
      return
    }
    const res = await tryToRecoverPassword(form.email, form.password, token)

    if(res.error.value){
      loading.error()
      isLoading.value = false
      errorHandler(res.error, notification)
    }else if(res.data.value){
      notification.success({
        title: 'Sucesso',
        description: 'Senha alterada com sucesso'
      })
      router.push({ path: '/app/login' })
    }
    loading.finish()
    isLoading.value = false
  }
}
</script>

<template>
  <div class="bg-gray-200 min-h-screen flex flex-col justify-center items-center px-4">
    <n-card :title="title" class="max-w-sm">
      <template #header-extra>
        <NuxtImg src="/img/logo/logo_1.svg" class="rounded" alt="logo'" width="50"/>
      </template>

      <form @submit.prevent>
        <label for="email">Email</label>
        <n-input
          class="mb-3"
          id="email"
          type="text"
          placeholder=""
          v-model:value="form.email"
        />

        <template v-if="token">
            <label for="password">Nova Senha</label>
            <n-input
            class="mb-3"
            id="password"
            type="password"
            show-password-on="click"
            placeholder=""
            v-model:value="form.password"
            />
            <label for="confirmPassword">Confirme a senha</label>
            <n-input
            class="mb-3"
            id="confirmPassword"
            type="password"
            show-password-on="click"
            placeholder=""
            v-model:value="form.confirmPassword"
            @keydown.enter="handleSubmit"
            />
        </template>

        <p v-if="!token">Enviaremos ao seu email um link para alterar sua senha.</p>
        
        <div class="flex justify-center mt-2">
          <n-button type="primary" class="flex-1" @click="handleSubmit" :loading="isLoading">Enviar</n-button>
        </div>
      </form>
    </n-card>

    <p class="mt-4">Lembrei minha senha! <NuxtLink :to="{ path: '/app/login' }" class="text-green-600 underline">Entrar</NuxtLink></p>
  </div>
</template>