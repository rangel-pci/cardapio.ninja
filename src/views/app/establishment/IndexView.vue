<script setup lang="ts">
import { onMounted, ref, computed, onUnmounted, reactive } from 'vue';
import { useLoadingBar, useNotification, type UploadFileInfo } from 'naive-ui'
import type { ResponseProduct, ResponseProductCreateUpdated, Product, ApiResponseEstablishment, Establishment, Module } from '@/types/Api'
import { useAuthStore } from '@/stores/AuthStore'
import Header from '@/components/app/HeaderComponent.vue'
import router from '@/router'
import EstablishmentInformation from '@/components/app/EstablishmentInformationComponent.vue'
import EstablishmentLinkAndQrCode from '@/components/app/EstablishmentLinkAndQrCodeComponent.vue'
import EstablishmentBanner from '@/components/app/EstablishmentBannerComponent.vue'
import EstablishmentCategories from '@/components/app/EstablishmentCategoriesComponent.vue'
import EstablishmentProducts from '@/components/app/EstablishmentProductsComponent.vue'
import type { BannerSection, EstablishmentFormData, InformationSection } from '@/types/EstablishmentManager';
import ModalCategory from '@/components/app/ModalCategoryComponent.vue';
import ModalBanner from '@/components/app/ModalBannerComponent.vue';
import ModalInformation from '@/components/app/ModalInformationComponent.vue';
import ModalProduct from '@/components/app/ModalProductComponent.vue';
import { tryToFetchEstablishment, tryToSaveEstablishment, tryToFetchEstablishmentProducts } from '@/services/EstablishmentService';
import { tryToCreateProduct, tryToSaveProduct, tryToDeleteProduct } from '@/services/ProductService'
import { ErrorHandler } from '@/utils/ErrorHandler';
import { Brush } from '@vicons/ionicons5';
import type { ProductFormData } from '@/types/Product';
import { IsOpen } from '@/utils/IsOpen';

onMounted(() => {
  getEstablishment()
})
const intervalIsOpen = setInterval(function(){
  isOpen.value = IsOpen(establishment.value?.store.contact?.open_close ?? [])
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
const paramId = router.currentRoute.value.params.id
const establishmentId = typeof paramId === 'string' ? parseInt(paramId) : parseInt(paramId[0])
const isOpen = ref(false)
const showBannerSectionModal = ref(false)
const showCategoryModal = ref(false)
const showProductModal = ref(false)
const showInformationSectionModal = ref(false)
const establishmentFormLoading = ref(false)
const targetProduct = ref<Product | null>(null)
const targetModule = ref<Module | null>(null)

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
// const openCategoryModal = () => {
//   categorySectionModules.value = establishment.value?.store?.modules ? JSON.parse(JSON.stringify(establishment.value?.store?.modules)) : []
//   showCategoryModal.value = true
// }
const checkFileFormatAndSize = (file: File) => {
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
  return true
}
const handleImageBeforeUpload = (data: { file: UploadFileInfo } | null) => {
  if(!data){bannerSection.image = null; return true }

  const file = data.file.file
  if(!file){
    return false
  }
  if(!checkFileFormatAndSize(file)){return false}
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
  if(!checkFileFormatAndSize(file)){return false}
  bannerSection.banner = file
  return true
}

const modulesCleanRepeatedProducts = () => {
  establishment.value?.store.modules?.forEach(module => {
    if(module.products_id){
      module.products_id = module.products_id.filter((productId, index, self) => self.indexOf(productId) === index)
    }
  })
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
  }else if(type == 'modules'){
    modulesCleanRepeatedProducts()
    data.store = JSON.stringify(establishment.value?.store)
  }

  const res = await tryToSaveEstablishment(authStore.token, establishmentId, data)
  if(res.success){
    const apiRes = res.data.data.establishment as ApiResponseEstablishment
    responseEstablishment.value = apiRes
    const store = JSON.parse(apiRes.store)
    const text = JSON.parse(apiRes.text)
    establishment.value = {
      ...apiRes,
      store,
      text
    }    
    callback && callback()
  }else if(res.error){
    loading.error()
    ErrorHandler(res.error, notification)
  }
  establishmentFormLoading.value = false
}

const addProductIdToModule = (productId: number, moduleName: string) => {
  if(!establishment.value?.store.modules){return false}
  const moduleIndex = establishment.value?.store.modules.findIndex(module => module.title == moduleName)
  if(moduleIndex != undefined && moduleIndex != -1){
    establishment.value?.store.modules[moduleIndex].products_id?.push(productId)
    return true
  }
  return false
}
const removeProductIdFromModule = (productId: number, moduleName: string) => {
  if(!establishment.value?.store.modules){return false}
  const moduleIndex = establishment.value?.store.modules.findIndex(module => module.title == moduleName)
  if(moduleIndex != undefined && moduleIndex != -1){
    establishment.value!.store.modules[moduleIndex].products_id = establishment.value?.store.modules[moduleIndex].products_id?.filter(id => id != productId)
  }
}

const handleSaveProduct = async( 
  productFormData: ProductFormData, 
  moduleName: string,
  targetProduct: Product | null, 
  targetModule: Module | null,  
  callback: Function | null
) => {
  if(!targetProduct){
    loading.start()
    const res = await tryToCreateProduct(authStore.token, establishmentId, productFormData)
    if(res.success){
      const apiRes = res.data as ResponseProductCreateUpdated
      products.value.push(apiRes.data.product)
      addProductIdToModule(apiRes.data.product.id, moduleName)
      await handleSave('modules')
      loading.finish()
      isLoading.value = false
      targetProduct = null
      targetModule = null
      callback && callback()
    }else if(res.error){
      loading.error()
      isLoading.value = false
      ErrorHandler(res.error, notification)
    }
  }else{
    loading.start()
    const res = await tryToSaveProduct(authStore.token, establishmentId, targetProduct.id, productFormData)
    if(res.success){
      const apiRes = res.data as ResponseProductCreateUpdated
      const productIndex = products.value.findIndex(product => product.id == apiRes.data.product.id)
      if(productIndex != undefined && productIndex != -1){
        products.value[productIndex] = apiRes.data.product
      }
      removeProductIdFromModule(targetProduct.id, targetModule?.title ?? '')
      addProductIdToModule(apiRes.data.product.id, moduleName)
      await handleSave('modules')
      loading.finish()
      isLoading.value = false
      targetProduct = null
      targetModule = null
      callback && callback()
    }else if(res.error){
      loading.error()
      isLoading.value = false
      ErrorHandler(res.error, notification)
    }
  }
}

const handleDeleteProduct = async(  
  productId: number, 
  targetModule: Module | null,  
  callback: Function | null
) => {
  loading.start()
  isLoading.value = true
  establishmentFormLoading.value = true
  const res = await tryToDeleteProduct(authStore.token, establishmentId, productId)
  if(res.success){
    if(targetModule){
      removeProductIdFromModule(productId, targetModule?.title ?? '')
    }
    isLoading.value = false
    establishmentFormLoading.value = false
    targetModule = null
    products.value = products.value.filter(product => product.id != productId)
    callback && callback()
  }else if(res.error){
    loading.error()
    isLoading.value = false
    establishmentFormLoading.value = false
    ErrorHandler(res.error, notification)
  }
}

const getEstablishment = async () => {
  loading.start()
  const res = await tryToFetchEstablishment(authStore.token, establishmentId)
  if(res.success){
    const apiRes = res.data.data as ApiResponseEstablishment
    responseEstablishment.value = apiRes
    const store = JSON.parse(apiRes.store)
    const text = JSON.parse(apiRes.text)
    establishment.value = {
      ...apiRes,
      store,
      text
    }
    getProducts(establishmentId)
  }else if(res.error){
    loading.error()
    ErrorHandler(res.error, notification)
  }
}

const getProducts = async (establishmentId: number, nextPage: number = 1) => {
  loading.start()
  const res = await tryToFetchEstablishmentProducts(authStore.token, establishmentId, nextPage)
  if(res.success){
    const apiRes = res.data as ResponseProduct
    products.value.push(...apiRes.data)
    loading.finish()
    isLoading.value = false
    if(products.value.length < apiRes.total){
      await getProducts(establishmentId, nextPage+=1)
    }
  }else if(res.error){
    loading.error()
    isLoading.value = false
    ErrorHandler(res.error, notification)
  }
}
</script>

<template>
  <Header />
  <div class="bg-gray-200 min-h-screen pb-8 flex flex-col items-center" v-if="establishment">
    <button @click="openBannerSectionModal" :class="'py-1 w-full max-w-6xl text-center text-white bg-['+colorTheme+']'">
      Seção de apresentação <n-icon><Brush class="animate-bounce md:hidden" /></n-icon>
    </button>
    <EstablishmentBanner :openModal="openBannerSectionModal" :establishment="establishment" :colorTheme="colorTheme"/>
    <div class="mx-auto main-container">
      <div class="px-4">
        <div :class="'py-1 w-full text-center text-white mt-6 bg-['+colorTheme+']'">Esta seção aparece apenas para você</div>
      </div>
      <EstablishmentLinkAndQrCode :establishment="establishment" :colorTheme="colorTheme"/>
      <div class="px-4">
        <button @click="openInformationSectionModal" :class="'py-1 w-full text-center text-white mt-6 bg-['+colorTheme+']'">
          Seção de informações <n-icon><Brush class="animate-bounce md:hidden" /></n-icon>
        </button>
      </div>
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
      <div class="px-4">
        <button @click="() => showCategoryModal = true" :class="'py-1 w-full text-center text-white mt-6 bg-['+colorTheme+']'">
          Seção de Categorias <n-icon><Brush class="animate-bounce md:hidden" /></n-icon>
        </button>
      </div>
      <EstablishmentCategories
        :openModal="() => showCategoryModal = true"
        :modules=" establishment.store.modules" 
        :colorTheme="colorTheme"
      />
      <div class="px-4">
        <div :class="'py-1 w-full text-center text-white mt-6 bg-['+colorTheme+']'">Seção de Produtos</div>
      </div>
      <EstablishmentProducts
        :openModal="() => { targetProduct = null; showProductModal = true }"
        :products="products" 
        :colorTheme="colorTheme"
        :modules="establishment?.store.modules ?? []"
        :onClickItem="(product: Product, module: Module | null) => { targetProduct = product; targetModule = module; showProductModal = true }"
      />
    </div>
  </div>

  <ModalProduct
    :handleDelete="handleDeleteProduct"
    :colorTheme="colorTheme"
    :handle-save="handleSaveProduct"
    :loading="establishmentFormLoading"
    :show="showProductModal"
    :modules="establishment?.store.modules ?? []"
    :targetProduct="targetProduct"
    :target-module="targetModule"
    @onClose="() => showProductModal = false"
  />
  <ModalCategory
    :colorTheme="colorTheme"
    :handle-save="handleSave"
    :loading="establishmentFormLoading"
    :show="showCategoryModal"
    :modules="establishment?.store.modules ?? []"
    @update-establishment-modules="(updatedModules: Module[]) => establishment!.store.modules = updatedModules"
    @onClose="() => showCategoryModal = false"
  />
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
</template>@/types/API@/types/EstablishmentManager@/types/Api