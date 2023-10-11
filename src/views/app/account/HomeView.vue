<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useLoadingBar, useNotification } from 'naive-ui';
import type { ResponseEstablishment, Establishment } from '@/types/Api';
import { useAuthStore } from '@/stores/AuthStore';
import { HelpCircle, AddCircle } from '@vicons/ionicons5'
import Header from '@/components/app/HeaderComponent.vue'
import categoriesList from './categoriesList'
import getDefaultEstablishmentData from './defaultEstablishmentData';
import EstablishmentCard from '@/components/app/EstablishmentCardComponent.vue';
import { tryToCreateEstablishment, tryToFetchUserEstablishments } from '@/services/EstablishmentService';
import { ErrorHandler } from '@/utils/ErrorHandler';

onMounted(() => {
  getEstablishments()
})

const APP_URL = import.meta.env.VITE_APP_URL
const loading = useLoadingBar()
const isLoading = ref(true)
const isLoadingSubmit = ref(false)
const establishments = ref<Establishment[]>([])
const notification = useNotification()
const authStore = useAuthStore()
const showNewEstablishmentForm = ref(false)
const form = reactive({
  category: 1,
  name: '',
  link_name: '',
})
const defaultEstablishmentData = await getDefaultEstablishmentData()

const handleSubmit = async () => {
  loading.start()
  isLoadingSubmit.value = true
  const data = { ...form, ...defaultEstablishmentData }
  const res = await tryToCreateEstablishment(authStore.token, data)
  if(res.success){
    loading.finish()
    isLoadingSubmit.value = false
    getEstablishments()
  }else if(res.error){
    loading.finish()
    isLoadingSubmit.value = false
    ErrorHandler(res.error, notification)
  }
}

const getEstablishments = async () => {
  loading.start()
  const res = await tryToFetchUserEstablishments(authStore.token, 1)
  if(res.success){
    showNewEstablishmentForm.value = false
    const apiRes = res.data.data as ResponseEstablishment
    establishments.value.push(...apiRes.data)
    loading.finish()
    isLoading.value = false
  }else if(res.error){
    loading.error()
    isLoading.value = false
    if(res.error.response?.status === 404){return showNewEstablishmentForm.value = true}
    ErrorHandler(res.error, notification)
  }
}
</script>

<template>
  <Header />
  <div class="bg-gray-200 min-h-screen flex flex-col px-4 items-center">
    <!-- new establishment form -->
    <n-card title="Novo Cardápio" class="max-w-md mx-4 mt-8" v-if="showNewEstablishmentForm">
      <form>
        <label for="name">Nome</label>
        <n-input
          class="mb-3"
          id="name"
          type="text"
          placeholder=""
          v-model:value="form.name"
        />
       
        <label for="category">Categoria</label>
        <n-select class="mb-3" id="category" v-model:value="form.category" :options="categoriesList" />

        <label for="link_name">
          <div class="flex items-center gap-1">
            Link 
            <n-tooltip trigger="hover" :style="{ maxWidth: '250px' }">
              <template #trigger>
                <n-icon class="hover:cursor-pointer" size="large">
                  <HelpCircle />
                </n-icon>
              </template>
              Com este link seus clientes terão acesso a página do seu cardápio.
            </n-tooltip>
          </div>
        </label>
        <div class="flex items-center gap-1">
          <span class="mb-3 text-gray-400">{{ APP_URL }}/</span>
          <n-input
            class="mb-3 flex-1"
            id="link_name"
            type="text"
            placeholder="restauranteda25"
            v-model:value="form.link_name"
          />
        </div>
        
        <div class="flex justify-center mt-2">
          <n-button type="primary" class="flex-1" @click="handleSubmit" :loading="isLoadingSubmit">Continuar</n-button>
        </div>
      </form>
    </n-card>
    <!-- my establishments -->
    <EstablishmentCard :loading="true" v-if="isLoading" />
    <template v-else v-for="establishment in establishments" :key="establishment.id">
      <EstablishmentCard :establishment="establishment" />
    </template>
    <!-- add new establishment button -->
    <div class="mt-8" v-if="!showNewEstablishmentForm">
      <n-button type="primary" disabled @click="showNewEstablishmentForm = true">
        <template #icon>
          <n-icon>
            <AddCircle />
          </n-icon>
        </template>
        Adicionar Novo Cardápio
      </n-button>
    </div>
  </div>
</template>