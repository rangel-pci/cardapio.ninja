<script setup lang="ts">
import type { ApiResponseEstablishment, Establishment, Module, Product } from '@/@types/api'
import {Cart, FastFoodOutline} from '@vicons/ionicons5'
  
  const route = useRoute()
  const router = useRouter()
  const loading = useLoadingBar()
  const isLoading = ref(false)
  const products = ref<Product[]>([])
  const link_name = route.params.establishmentPage[0];
  const establishment = ref<Establishment | null>(null)
  const isOpen = ref(false)
  const targetModule = ref<Module | null>(null)
  const targetProduct = ref<Product | null>(null)
  const showProductModal = ref(false)
  const showOrderModal = ref(false)
  const cartStore = useCartStore()

  onMounted(async () => {
    await getPageData(link_name)
  })
  const intervalIsOpen = setInterval(function(){
    isOpen.value = setIsOpen(establishment.value?.store.contact?.open_close ?? [])
  }, 1000);
  onUnmounted(() => {
    clearInterval(intervalIsOpen)
  })

  const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const colorTheme = computed(() => {
    const color = establishment.value?.store?.theme ?? '#6C5CE7'
    return color
  })

  const changeFavicon = (url: string) => {
    let favicon = document.querySelector('link[rel="icon"]')
    if (!favicon) {
      favicon = document.createElement('link')
      favicon.setAttribute('rel', 'icon')
      favicon.setAttribute('type', 'image/png')
      document.head.appendChild(favicon)
    }
    favicon.setAttribute('href', url)
  }
  const getPageData = async (link_name: string) => {
    loading.start()
    isLoading.value = true
    const res = await tryToFetchEstablishmentPage(link_name)

    if(res.error.value){
      loading.error()
      router.push({ path: '/' })
    }else if(res.data.value){
      const apiResEstab = res.data.value as {establishment: ApiResponseEstablishment}
      const apiResProd = res.data.value as {products: Product[]}
      products.value = apiResProd.products
      const store = JSON.parse(apiResEstab.establishment.store)
      const text = JSON.parse(apiResEstab.establishment.text)
      establishment.value = {
      ...apiResEstab.establishment,
      store,
      text
      }
      document.title = establishment.value.name
      changeFavicon(establishment.value.image)
    }
    
    loading.finish()
    isLoading.value = false
  }
</script>

<template>
  <div>
    <div v-if="isLoading" class="flex items-center justify-center h-screen p-4">
      <n-card class="max-w-sm text-center text-neutral-800">
        <h5 class="font-semibold">Carregando cardápio...</h5>
        <div class="flex justify-center mt-2">
          <FastFoodOutline width="20" class="text-green-500 animate-ping" />
        </div>
      </n-card>
    </div>
    <div v-else-if="establishment" ref="containerRef" class="flex flex-col items-center min-h-screen pb-16 bg-gray-200">
      <AppEstablishmentBanner :establishment="establishment" :colorTheme="colorTheme"/>
      <div class="mx-auto main-container">
        <AppEstablishmentInformation
          class="mt-4 md:mt-8"
          :days-of-week="daysOfWeek" 
          :establishment="establishment" 
          :is-open="isOpen" 
          :minimum-order-amount="establishment.store.minimum_order ?? ''"
          :whatsapp="establishment.store.contact?.whatsapp ?? ''"
          :phone="establishment.store.contact?.telephone ?? ''"
          :colorTheme="colorTheme"
        />

        <AppEstablishmentCategories
          class="sticky top-0 z-10 mt-8 mb-8"
          visit-page
          :modules=" establishment.store.modules" 
          :colorTheme="colorTheme"
        />

        <AppEstablishmentProducts
          :products="products" 
          :colorTheme="colorTheme"
          :modules="establishment?.store.modules ?? []"
          :onClickItem="(product: Product, module: Module | null) => { targetProduct = product; targetModule = module; showProductModal = true;  }"
        />
      </div>

      <AppEstablishmentPageModalProduct
        :colorTheme="colorTheme"
        :show="showProductModal"
        :targetProduct="targetProduct"
        @onClose="() => { showProductModal = false; }"
      />

      <AppEstablishmentPageModalOrder
        :establishment="establishment"
        :colorTheme="colorTheme"
        :show="showOrderModal"
        @onClose="() => { showOrderModal = false; }"
      />

      <div v-if="cartStore.cartItems.filter(item => item.quantity > 0).length > 0" class="fixed bottom-4 left-0 w-full flex justify-center">
        <button @click="showOrderModal = true" :class="`bg-[${colorTheme}] p-2 text-white rounded-2xl flex justify-between gap-4 w-full max-w-md text-lg mx-2 shadow-md shadow-slate-400`">
          <span :class="`bg-white rounded-xl text-[${colorTheme}] px-2 flex items-center gap-1`">
            <n-icon :color="colorTheme" size="16"><Cart/></n-icon>{{ cartStore.cartTotalItems }}
          </span>
          Finalizar Pedido
          <span class="font-bold">{{ formatMoneyBRL(cartStore.cartTotal) }}</span>
        </button>
      </div>
    </div>
  </div>
</template>