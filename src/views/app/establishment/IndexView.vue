<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { ApiService, ErrorHandler } from '@/services/ApiService'
import { useLoadingBar, useNotification } from 'naive-ui';
import type { AxiosError } from 'axios';
import type { ResponseProduct, Product, Establishment } from '@/types/api';
import { useAuthStore } from '@/stores/user';
import { HelpCircle, AddCircle, Brush, DownloadOutline } from '@vicons/ionicons5'
import Header from '@/components/app/HeaderComponent.vue'
import router from '@/router'
import QrcodeVue from 'qrcode.vue'

onMounted(() => {
  getEstablishment()
})

const APP_URL = import.meta.env.VITE_APP_URL
const loading = useLoadingBar()
const isLoading = ref(true)
const notification = useNotification()
const authStore = useAuthStore()
const establishment = ref<Establishment | null>(null)
const products = ref<Product[]>([])
const establishmentId = router.currentRoute.value.params.id
const colorTheme = computed(() => {
  const color = establishment.value?.store?.theme ?? '6C5CE7'
  return '#'+color
})

const downloadQrCode = () => {
  const canvas = document.querySelector('canvas') as HTMLCanvasElement
  const link = document.createElement('a')
  link.download = establishment.value?.link_name + '-qr-code-cardapio.ninja.png'
  link.href = canvas.toDataURL()
  link.click()
}

const getEstablishment = async () => {
  loading.start()
  await ApiService.get('/establishments/' + establishmentId, {headers: { Authorization: `Bearer ${authStore.token}` }})
  .then(res => {
    const apiRes = res.data.data as Establishment
    establishment.value = apiRes
    getProducts(parseInt(establishmentId as string))
  })
  .catch((error: AxiosError) => {
    loading.error()
  
    ErrorHandler(error, (errorMessages: string[]) => {
        errorMessages.forEach(msg => {
            notification.error({
                content: 'Erro',
                meta: msg,
            })
        })
    })
  })
}
const getProducts = async (establishmentId: number, nextPage: string | null = null) => {
  loading.start()
  await ApiService.get('/establishments/' + establishmentId + '/products', {headers: { Authorization: `Bearer ${authStore.token}` }})
  .then(res => {
    const apiRes = res.data as ResponseProduct
    products.value.push(...apiRes.data)

    if(products.value.length < apiRes.total){
      return getProducts(establishmentId, apiRes.next_page_url)
    }
    loading.finish()
    isLoading.value = false
  })
  .catch((error: AxiosError) => {
    loading.error()
    isLoading.value = false
  
    ErrorHandler(error, (errorMessages: string[]) => {
        errorMessages.forEach(msg => {
            notification.error({
                content: 'Erro',
                meta: msg,
            })
        })
    })
  })
}
</script>

<template>
  <Header />
  <div class="bg-gray-200 min-h-screen flex flex-col items-center" v-if="establishment">
    <!-- Banner -->
    <div class="relative flex flex-row items-center justify-start gap-2 w-full h-40 md:h-60 max-w-6xl rounded-b-md overflow-hidden" id="banner-container">
      <img :src="establishment.banner" :alt="establishment.name" class="object-cover h-40 md:h-60 w-full absolute top-0 left-0 z-0 opacity-75">
      <img :src="establishment.image" :alt="establishment.name" class="ml-4 w-24 h-24 object-cover rounded-[100%] z-10">
      <h1 class="text-white text-2xl font-bold text-shadow uppercase z-10">{{ establishment.name.toUpperCase() }}</h1>
      
      <div class="absolute right-4 bottom-4">
        <n-button type="info" size="large" :color="colorTheme">
          <template #icon>
            <n-icon><Brush /></n-icon>
          </template>

          Editar
        </n-button>
      </div>
    </div>

    <p class="mt-4">Link do seu cardápio: <a :href="APP_URL+'/'+establishment.link_name" target="_blank" :class="'font-medium mb-3 text-['+colorTheme+']'">{{ APP_URL }}/{{ establishment.link_name }}</a></p>
    <p class="mt-2  ">QR Code do seu cardápio:</p>
    <div class="mb-2 p-1" >
      <QrcodeVue :margin="2" :size="150" :value="APP_URL+'/'+establishment.link_name"></QrcodeVue>
    </div>
    <n-button type="info" size="large" :color="colorTheme" @click="downloadQrCode">
      <template #icon>
        <n-icon><DownloadOutline /></n-icon>
      </template>

      Baixar
    </n-button>

    <div class="mt-8 bg-white w-full p-4 text-[12px] text-center">
      <div class="flex gap-1 justify-center flex-wrap">
        <span class="font-medium">⏰ Aberto agora</span>
        <span class="font-medium">💲 Pedido min. R$20</span>
        <span class="font-medium">📞 (61) 99215-6634</span>
      </div>
    </div>
    <div class="mt-2 text-left">
      <n-collapse>
        <n-collapse-item title="Mais informações" name="1">
          <div class="bg-white rounded p-2">
            <div class="font-medium">Horário</div>
            <div>Domingo: 17:30 às 23:45</div>
            <div>Segunda-Feira: 17:30 às 23:45</div>
            <div>Terça-Feira: 17:30 às 23:45</div>
            <div>Quarta-Feira: 17:30 às 23:45</div>
            <div>Quinta-Feira: 17:30 às 23:45</div>
            <div>Sexta-Feira: 17:30 às 23:45</div>
            <div>Sábado: 17:30 às 23:45</div>
          </div>
          <div class="bg-white rounded p-2 mt-1">
            <div class="font-medium">Endereço</div>
            <div>Setor Residencial Oeste (São Sebastião)</div>
          </div>
        </n-collapse-item>
      </n-collapse>
    </div>
  </div>
</template>

<style scoped>
.text-shadow{
  text-shadow: 0 0 10px #000;
}
</style>