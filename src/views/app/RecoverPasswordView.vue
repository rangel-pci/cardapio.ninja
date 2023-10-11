<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useLoadingBar, useNotification } from 'naive-ui';
import { tryToSendRecoverPasswordToken, tryToRecoverPassword } from '@/services/AuthService';
import { ErrorHandler } from '@/utils/ErrorHandler'
import { useRoute } from 'vue-router';
import router from '@/router';

const account = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})
const loading = useLoadingBar()
const isLoading = ref(false)
const notification = useNotification()
const token = useRoute().query.token as string ?? null
const title = token ? 'Alterar Senha' : 'Recuperar Senha'
document.title = title

const handleSubmit = async () => {
  loading.start()
  isLoading.value = true
  if(!token){
    const res = await tryToSendRecoverPasswordToken(account.email)
    if(res.success){
      notification.success({
        title: 'Sucesso',
        description: 'Enviamos um email com um link para alterar sua senha'
      })
    }else if(res.error){
      ErrorHandler(res.error, notification)
    }
    loading.finish()
    isLoading.value = false
  }else{
    if(account.password !== account.confirmPassword){
      alert('As senhas não conferem')
      loading.finish()
      isLoading.value = false
      return
    }
    const res = await tryToRecoverPassword(account.email, account.password, token)

    if(res.success){
      notification.success({
        title: 'Sucesso',
        description: 'Senha alterada com sucesso'
      })
      router.push({ name: 'login' })
    }else if(res.error){
      ErrorHandler(res.error, notification)
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

        <template v-if="token">
            <label for="password">Nova Senha</label>
            <n-input
            class="mb-3"
            id="password"
            type="password"
            show-password-on="click"
            placeholder=""
            v-model:value="account.password"
            />
            <label for="confirmPassword">Confirme a senha</label>
            <n-input
            class="mb-3"
            id="confirmPassword"
            type="password"
            show-password-on="click"
            placeholder=""
            v-model:value="account.confirmPassword"
            @keydown.enter="handleSubmit"
            />
        </template>

        <p v-if="!token">Enviaremos ao seu email um link para alterar sua senha.</p>
        
        <div class="flex justify-center mt-2">
          <n-button type="primary" class="flex-1" @click="handleSubmit" :loading="isLoading">Enviar</n-button>
        </div>
      </form>
    </n-card>

    <p class="mt-4">Lembrei minha senha! <RouterLink :to="{ name: 'login' }" class="text-green-600 underline">Entrar</RouterLink></p>
  </div>
</template>