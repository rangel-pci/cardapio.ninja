<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { useLoadingBar } from 'naive-ui'
import { tryToFetchVisitPage } from '@/services/visitPage/VisitPageService'
import type { ApiResponseEstablishment, Establishment, Module, Product } from '@/types/Api'
import {FastFoodOutline} from '@vicons/ionicons5'
import router from '@/router/index';
import EstablishmentBanner from '@/components/app/EstablishmentBannerComponent.vue';
import EstablishmentInformation from '@/components/app/EstablishmentInformationComponent.vue';
import { IsOpen } from '@/utils/IsOpen';
import EstablishmentCategories from '@/components/app/EstablishmentCategoriesComponent.vue';
import EstablishmentProducts from '@/components/app/EstablishmentProductsComponent.vue';
import ModalProduct from '@/components/app/visitPage/ModalProductDetailsComponent.vue';
import { useCartStore } from '@/stores/visitPage/CartStore';
    
    const route = useRoute()
    const loading = useLoadingBar()
    const isLoading = ref(false)
    const products = ref<Product[]>([])
    const link_name = Array.isArray(route.params.link_name) ? route.params.link_name[0] : route.params.link_name;
    const establishment = ref<Establishment | null>(null)
    const isOpen = ref(false)
    const targetModule = ref<Module | null>(null)
    const targetProduct = ref<Product | null>(null)
    const showProductModal = ref(false)
    const cartStore = useCartStore()

    onMounted(async () => {
        await getPageData(link_name)
    })
    const intervalIsOpen = setInterval(function(){
        isOpen.value = IsOpen(establishment.value?.store.contact?.open_close ?? [])
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
        const res = await tryToFetchVisitPage(link_name)

        if(res.success){
            const apiResEstab = res.data.establishment as ApiResponseEstablishment
            products.value = res.data.products as Product[]
            const store = JSON.parse(apiResEstab.store)
            const text = JSON.parse(apiResEstab.text)
            establishment.value = {
            ...apiResEstab,
            store,
            text
            }
            document.title = establishment.value.name
            changeFavicon(establishment.value.image)
            loading.finish()
            isLoading.value = false
        }else if(res.error){
            loading.error()
            router.push({ name: 'home' })
        }
    }
</script>

<template>
    <div v-if="isLoading" class="h-screen p-4 flex items-center justify-center">
        <n-card class="max-w-sm text-center text-neutral-800">
            <h5 class="font-semibold">Carregando cardápio...</h5>
            <div class="flex justify-center mt-2">
                <FastFoodOutline width="20" class="animate-ping text-green-500" />
            </div>
        </n-card>
    </div>
    <div v-else-if="establishment" ref="containerRef" class="bg-gray-200 min-h-screen pb-4 flex flex-col items-center">
        <EstablishmentBanner :establishment="establishment" :colorTheme="colorTheme"/>
        <div class="mx-auto main-container">
            <EstablishmentInformation
                class="mt-4 md:mt-8"
                :days-of-week="daysOfWeek" 
                :establishment="establishment" 
                :is-open="isOpen" 
                :minimum-order-amount="establishment.store.minimum_order ?? ''"
                :whatsapp="establishment.store.contact?.whatsapp ?? ''"
                :phone="establishment.store.contact?.telephone ?? ''"
                :colorTheme="colorTheme"
            />

            <EstablishmentCategories
                class="mt-8 mb-8 sticky top-0 z-10"
                visit-page
                :modules=" establishment.store.modules" 
                :colorTheme="colorTheme"
            />

            <EstablishmentProducts
                :products="products" 
                :colorTheme="colorTheme"
                :modules="establishment?.store.modules ?? []"
                :onClickItem="(product: Product, module: Module | null) => { targetProduct = product; targetModule = module; showProductModal = true;  }"
            />
        </div>

        <ModalProduct
            :colorTheme="colorTheme"
            :show="showProductModal"
            :targetProduct="targetProduct"
            @onClose="() => { showProductModal = false; }"
        />

        <div v-if="cartStore.cartItems.length > 0">aaaa</div>
    </div>
</template>