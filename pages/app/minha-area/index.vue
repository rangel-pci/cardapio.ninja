<script setup lang="ts">
import { HelpCircle, AddCircle } from '@vicons/ionicons5'
import { Establishment, ResponseEstablishment } from '~/@types/api';

onMounted(() => {
  getEstablishments()
})

useHead({
  titleTemplate: (titleChunk: string | undefined) => {
    return titleChunk ? `${titleChunk} - Cardápios` : 'Cardápios';
  }
})
definePageMeta({
  requiresAuth: true
})
const runtimeConfig = useRuntimeConfig()
const APP_URL = runtimeConfig.public.appUrl
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

const handleSubmit = async () => {
  loading.start()
  isLoadingSubmit.value = true
  const defaultEstablishmentData = await getDefaultEstablishmentData()
  const data = { ...form, ...defaultEstablishmentData }
  const res = await tryToCreateEstablishment(authStore.getToken(), data)
  if(res.error.value){
    loading.error()
    isLoadingSubmit.value = false
    errorHandler(res.error, notification)
  }else if(res.data.value){
    loading.finish()
    isLoadingSubmit.value = false
    getEstablishments()
  }
}

const getEstablishments = async () => {
  loading.start()
  const res = await tryToFetchUserEstablishments(authStore.getToken(), 1)
  if(res.error.value){
    loading.error()
    isLoading.value = false
    if(res.error.value.statusCode === 404){return showNewEstablishmentForm.value = true}
    errorHandler(res.error, notification)
  }else if(res.data.value){
    showNewEstablishmentForm.value = false
    const apiRes = res.data.value as {data: ResponseEstablishment}
    establishments.value.push(...apiRes.data.data)
    loading.finish()
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <AppHeader />
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
      <AppEstablishmentCard :loading="true" v-if="isLoading" />
      <template v-else v-for="establishment in establishments" :key="establishment.id">
        <AppEstablishmentCard :establishment="establishment" />
      </template>
      <!-- add new establishment button -->
      <div class="mt-8">
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
  </div>
</template>