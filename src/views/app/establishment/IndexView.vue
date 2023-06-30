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
const showInformationSectionModal = ref(false)
const establishmentFormLoading = ref(false)

const bannerSection = reactive<BannerSection>({
  name: '',
  image: null ,
  banner: null,
})
const informationSection = reactive<InformationSection>({
  notice: '',
  minimum_order: 'R$ 0,00',
  contact: {
    address: '',
    email: '',
    open_close: [
      {open: null,close: null},
      {open: null,close: null},
      {open: null,close: null},
      {open: null,close: null},
      {open: null,close: null},
      {open: null,close: null},
      {open: null,close: null},
    ],
    telephone: '',
    whatsapp: '',
  },
})

const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const colorTheme = computed(() => {
  const color = establishment.value?.store?.theme ?? '#6C5CE7'
  return color
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

  const openHour = new Date(open).getHours()
  const openMinute = new Date(open).getMinutes()
  const closeHour = new Date(close).getHours()
  const closeMinute = new Date(close).getMinutes()

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
  const temp = [] as { open: number | null, close: number | null}[]
  establishment.value?.store?.contact?.open_close.forEach(open_close => {
    if(open_close){
      temp.push({...open_close})
    }else{
      temp.push({open: null, close: null})
    }
  })
  informationSection.notice = establishment.value?.store.notice ?? ''
  informationSection.minimum_order = establishment.value?.store?.minimum_order ?? ''
  informationSection.contact = {
    address: establishment.value?.store?.contact?.address ?? '',
    email: establishment.value?.store?.contact?.email ?? '',
    telephone: establishment.value?.store?.contact?.telephone ?? '',
    whatsapp: establishment.value?.store?.contact?.whatsapp ?? '',
    open_close: temp,
  }
  showInformationSectionModal.value = true
}
const handleImageBeforeUpload = (data: { file: UploadFileInfo } | null) => {
  if(!data){bannerSection.image = null; return true }

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
  if(file.size > 2000000){
    notification.error({
      content: 'Erro',
      meta: 'Tamanho máximo de imagem é 2MB',
    })
    return false
  }
  
  bannerSection.image = file
  console.log(file)
  return true
}
const handleBannerBeforeUpload = (data: { file: UploadFileInfo } | null) => {
  if(!data){bannerSection.banner = null; return true }

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
  if(file.size > 2000000){
    notification.error({
      content: 'Erro',
      meta: 'Tamanho máximo de imagem é 2MB',
    })
    return false
  }
  bannerSection.banner = file
  return true
}
const handleSave = async (type: string, callback: Function | null = null) => {
  establishmentFormLoading.value = true
  //eslint-disable-next-line
  const {image, banner, ...rest } = establishment.value as {image: string, banner: string}
  const data = {...rest, store: JSON.stringify(establishment.value?.store), text: JSON.stringify(establishment.value?.text)} as EstablishmentFormData
  if(type == 'banner'){
    data.name = bannerSection.name
    bannerSection.image && (data.image = bannerSection.image)
    bannerSection.banner && (data.banner = bannerSection.banner)
  }else if(type == 'information'){
    data.store = JSON.stringify({modules: establishment.value?.store.modules, ...informationSection})
  }

  await ApiService.post('/establishments/' + establishmentId, data, {headers: { Authorization: `Bearer ${authStore.token}`, "Content-Type": "multipart/form-data" }})
  .then(res => {
    const apiRes = res.data.data.establishment as ApiResponseEstablishment
    responseEstablishment.value = apiRes
    const store = JSON.parse(apiRes.store)
    const text = JSON.parse(apiRes.text)
    establishment.value = {
      ...apiRes,
      store,
      text
    }

    establishmentFormLoading.value = false
    callback && callback()
  })
  .catch((error: AxiosError) => {
    establishmentFormLoading.value = false
  
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
        :is-open="isOpen" 
        :minimum-order-amount="establishment.store.minimum_order ?? ''"
        :whatsapp="establishment.store.contact?.whatsapp ?? ''"
        :phone="establishment.store.contact?.telephone ?? ''"
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
    :daysOfWeek="daysOfWeek"
    @update-informationSection-notice="(value: string) => informationSection.notice = value"
    @update-informationSection-whatsapp="(value: string) => informationSection.contact.whatsapp = value"
    @update-informationSection-telephone="(value: string) => informationSection.contact.telephone = value"
    @update-informationSection-minimum_order="(value: string) => informationSection.minimum_order = value"
    @update-informationSection-address="(value: string) => informationSection.contact.address = value"
    @update-informationSection-open="(hourMin: number | null, index: number) => informationSection.contact.open_close[index].open = hourMin"
    @update-informationSection-close="(hourMin: number | null, index: number) => informationSection.contact.open_close[index].close = hourMin"
    @onClose="showInformationSectionModal = false"
  />
</template>