<script setup lang="ts">
import type { Product } from '@/types/Api';
import { useAuthStore } from '../../stores/AuthStore';
import { Brush } from '@vicons/ionicons5';

defineProps<{
    product: Product | undefined,
    colorTheme: string,
}>()

const authStore = useAuthStore()

const truncate = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
}

const formatMoney = (value: number) => {
    return value.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
}
</script>

<template>
   <div v-if="product" class="flex flex-col border rounded my-2 bg-white hover:shadow-md shadow-green-600 cursor-pointer overflow-hidden">
        <div class="flex relative">
            <div v-if="authStore.token" :class="`bg-[${colorTheme}] absolute top-0 right-0 z-50 rounded-bl w-8 h-8 flex items-center justify-center`"><n-icon><Brush class="text-white animate-bounce" /></n-icon></div>
            <div :class="`bg-[${colorTheme}] pl-1`"></div>
            <div class="w-24 h-24 overflow-hidden border-r">
                <img :src="product.image" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 px-2">
                <h2 class="font-bold text-neutral-800">{{ product.name }}</h2>
                <p class="text-[12px] leading-3 text-neutral-500">{{ truncate(product.description, 120) }}</p>
            </div>
        </div>
        <div v-if="(product.price_small && product.price_small > 0 && product.price_medium && product.price_medium > 0) 
        || (product.price_small && product.price_small > 0 && product.price_big && product.price_big > 0)" 
            :class="`text-white font-medium text-lg text-center p-2 bg-[${colorTheme}]`"
        >
            <span class="text-sm font-light">a partir de </span>{{ formatMoney(product.price_small/100) }}
        </div>
        <div v-else-if="product.price_small && product.price_small > 0" 
            :class="`text-white font-medium text-lg text-center p-2 bg-[${colorTheme}]`"
        >
            {{ formatMoney(product.price_small/100) }}
        </div>
        <div v-else 
            :class="`text-white font-medium text-lg text-center p-2 bg-[${colorTheme}]`"
        >
            Gratuito
        </div>
    </div>
</template>