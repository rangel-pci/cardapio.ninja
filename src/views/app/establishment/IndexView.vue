<script setup lang="ts">
import { onMounted, ref, computed, onUnmounted, reactive } from 'vue';
import { ApiService, ErrorHandler } from '@/services/ApiService'
import { useLoadingBar, useNotification, type UploadFileInfo } from 'naive-ui'
import type { AxiosError } from 'axios';
import type { ResponseProduct, Product, ApiResponseEstablishment, Establishment } from '@/types/api'
import { useAuthStore } from '@/stores/user'
import Header from '@/components/app/HeaderComponent.vue'
import router from '@/router'
import EstablishmentInformation from '@/components/app/EstablishmentInformationComponent.vue'
import EstablishmentLinkAndQrCode from '@/components/app/EstablishmentLinkAndQrCodeComponent.vue'
import EstablishmentBanner from '@/components/app/EstablishmentBannerComponent.vue'
import type { BannerSection, EstablishmentFormData, InformationSection } from '@/types/establishmentManager';
import ModalBanner from '@/components/app/ModalBannerComponent.vue';
import ModalInformation from '@/components/app/ModalInformationComponent.vue';

onMounted(() => {
  getEstablishment()
})
const intervalIsOpen = setInterval(function(){
  isOpen.value = setIsOpen()
}, 1000);
onUnmounted(() => {
  clearInterval(intervalIsOpen)
})

const loading = useLoadingBar()
const isLoading = ref(true)
const notification = useNotification()
const authStore = useAuthStore()
const responseEstablishment = ref<ApiResponseEstablishment | null>(null)
const establishment = ref<Establishment | null>(null)
const products = ref<Product[]>([])
const establishmentId = router.currentRoute.value.params.id
const isOpen = ref(false)
const showBannerSectionModal = ref(false)
const showInformationSectionModal = ref(true)
const establishmentFormLoading = ref(false)

const bannerSection = reactive<BannerSection>({
  name: '',
  image: null ,
  banner: null,
})
const informationSection = reactive<InformationSection>({
  notice: '',
  minimum_order: 0,
  contact: {
    address: '',
    email: '',
    open_close: [
      {open: '',close: ''},
      {open: '',close: ''},
      {open: '',close: ''},
      {open: '',close: ''},
      {open: '',close: ''},
      {open: '',close: ''},
      {open: '',close: ''},
    ],
    telephone: '',
    whtasapp: '',
  },
})

const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const colorTheme = computed(() => {
  const color = establishment.value?.store?.theme ?? '6C5CE7'
  return color
})
const formatTime = (time: string) =>{
  const hour = time.split(':')[0]
  const minute = time.split(':')[1]
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
}
const minimumOrderAmount = computed(() => {
  const amount = establishment.value?.store?.minimum_order ?? 0
  return amount > 0 ? amount.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) : false
})
const phone = computed(() => {
  const phone = establishment.value?.store?.contact?.telephone
  if(!phone){
    return false
  }
  const ddd = phone.substring(0, 2)
  const first = phone.substring(2, 7)
  const last = phone.substring(7, 11)
  return `(${ddd}) ${first}-${last}`
})
const setIsOpen = () => {
  const now = new Date()
  const day = now.getDay()
  const hour = now.getHours()
  const minute = now.getMinutes()
  const open = establishment.value?.store?.contact?.open_close[day].open
  const close = establishment.value?.store?.contact?.open_close[day].close
  if(!open || !close){
    return false
  }
  const openHour = parseInt(open.split(':')[0])
  const openMinute = parseInt(open.split(':')[1])
  const closeHour = parseInt(close.split(':')[0])
  const closeMinute = parseInt(close.split(':')[1])

  if(hour >= openHour && hour <= closeHour){
    if(hour == openHour && minute < openMinute){
      return false
    }
    if(hour == closeHour && minute > closeMinute){
      return false
    }
    return true
  }
  return false
}
const openBannerSectionModal = () => {
  bannerSection.name = establishment.value?.name ?? ''
  bannerSection.image = null
  bannerSection.banner = null
  showBannerSectionModal.value = true
}
const openInformationSectionModal = () => {
  const temp = [] as { open: string, close: string,}[]
  establishment.value?.store?.contact?.open_close.forEach(open_close => {
    if(open_close){
      temp.push({...open_close})
    }else{
      temp.push({open: '', close: ''})
    }
  })
  informationSection.notice = establishment.value?.store.notice ?? ''
  informationSection.minimum_order = establishment.value?.store?.minimum_order ?? 0
  informationSection.contact = {
    address: establishment.value?.store?.contact?.address ?? '',
    email: establishment.value?.store?.contact?.email ?? '',
    telephone: establishment.value?.store?.contact?.telephone ?? '',
    whtasapp: establishment.value?.store?.contact?.whtasapp ?? '',
    open_close: temp,
  }
  showInformationSectionModal.value = true
}
const handleImageBeforeUpload = (data: { file: UploadFileInfo }) => {
  const file = data.file.file
  if(!file){
    return false
  }
  if(file.type != 'image/jpeg' && file.type != 'image/png'){
    notification.error({
      content: 'Erro',
      meta: 'Formato de imagem inválido',
    })
    return false
  }
  if(file.size > 1000000){
    notification.error({
      content: 'Erro',
      meta: 'Tamanho máximo de imagem é 1MB',
    })
    return false
  }
  bannerSection.image = file
  return true
}
const handleBannerBeforeUpload = (data: { file: UploadFileInfo }) => {
  const file = data.file.file
  if(!file){
    return false
  }
  if(file.type != 'image/jpeg' && file.type != 'image/png'){
    notification.error({
      content: 'Erro',
      meta: 'Formato de imagem inválido',
    })
    return false
  }
  if(file.size > 1000000){
    notification.error({
      content: 'Erro',
      meta: 'Tamanho máximo de imagem é 1MB',
    })
    return false
  }
  bannerSection.banner = file
  return true
}
const handleSave = (type: string) => {
  establishmentFormLoading.value = true
  //eslint-disable-next-line
  const {image, banner, ...rest } = establishment.value as {image: string, banner: string}
  const data = {...rest, store: JSON.stringify(establishment.value?.store), text: JSON.stringify(establishment.value?.text)} as EstablishmentFormData
  if(type == 'bannerd'){
    data.name = bannerSection.name
    bannerSection.image && (data.image = bannerSection.image)
    bannerSection.banner && (data.banner = bannerSection.banner)
  }if(type == 'banner'){
    data.store = JSON.stringify({modules: establishment.value?.store.modules, ...informationSection})
  }

  establishmentFormLoading.value = false
  console.log(data)
}

const getEstablishment = async () => {
  loading.start()
  await ApiService.get('/establishments/' + establishmentId, {headers: { Authorization: `Bearer ${authStore.token}` }})
  .then(res => {
    const apiRes = res.data.data as ApiResponseEstablishment
    responseEstablishment.value = apiRes
    const store = JSON.parse(apiRes.store)
    const text = JSON.parse(apiRes.text)
    establishment.value = {
      ...apiRes,
      store,
      text
    }
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
const getProducts = async (establishmentId: number, nextPage: number = 1) => {
  loading.start()
  const query = '/establishments/' + establishmentId + '/products' + '?page=' + nextPage
  await ApiService.get(query, {headers: { Authorization: `Bearer ${authStore.token}` }})
  .then(res => {
    const apiRes = res.data as ResponseProduct
    products.value.push(...apiRes.data)

    if(products.value.length < apiRes.total){
      return getProducts(establishmentId, parseInt(apiRes.next_page_url))
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
  <div class="bg-gray-200 min-h-screen pb-8 flex flex-col items-center" v-if="establishment">
    <div :class="'py-1 w-full text-center text-white bg-['+colorTheme+']'">Seção de apresentação</div>
    <EstablishmentBanner :openModal="openBannerSectionModal" :establishment="establishment" :colorTheme="colorTheme"/>
    <div class="mx-auto main-container">
      <div :class="'py-1 w-full text-center text-white mt-6 bg-['+colorTheme+']'">Esta seção aparece apenas para você</div>
      <EstablishmentLinkAndQrCode :establishment="establishment" :colorTheme="colorTheme"/>
      <div :class="'py-1 w-full text-center text-white mt-6 bg-['+colorTheme+']'">Seção de informações</div>
      <EstablishmentInformation 
        :openModal="openInformationSectionModal"
        :days-of-week="daysOfWeek" 
        :establishment="establishment" 
        :format-time="formatTime" 
        :is-open="isOpen" 
        :minimum-order-amount="minimumOrderAmount"
        :phone="phone"
        :colorTheme="colorTheme"
      />
    </div>
  </div>

  <ModalBanner 
    :banner-section="bannerSection" 
    :handle-image-before-upload="handleImageBeforeUpload" 
    :handle-banner-before-upload="handleBannerBeforeUpload"
    :handle-save="handleSave"
    :loading="establishmentFormLoading"
    :show="showBannerSectionModal"
    @update-bannerSection-name="(name: string) => bannerSection.name = name"
    @close="showBannerSectionModal = false"
  />
  <ModalInformation
    :colorTheme="colorTheme"
    :information-section="informationSection" 
    :handle-save="handleSave"
    :loading="establishmentFormLoading"
    :show="showInformationSectionModal"
    @update-informationSection-notice="(notice: string) => informationSection.notice = notice"
    @close="showInformationSectionModal = false"
  />
</template>

<style scoped>
.text-shadow{
  text-shadow: 0 0 10px #000;
}
</style>