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
   <div v-if="product" class="flex border rounded my-2 bg-white hover:shadow-md shadow-green-600 cursor-pointer overflow-hidden">
        <div :class="`bg-[${colorTheme}] pl-1`"></div>
        <div class="flex-1 flex flex-col">
            <div class="flex relative">
                <div v-if="authStore.token" :class="`bg-[${colorTheme}] absolute top-0 right-0 z-50 rounded-bl w-8 h-8 flex items-center justify-center`"><n-icon><Brush class="text-white animate-bounce" /></n-icon></div>
                <div class="w-24 h-24 overflow-hidden">
                    <img :src="product.image" alt="imagem do produto" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 px-2 border-l">
                    <h2 class="font-bold text-lg text-neutral-800">{{ product.name }}</h2>
                    <p class="text-sm text-neutral-500">{{ truncate(product.description, 70) }}</p>
                </div>
            </div>
            <div v-if="(product.price_small && product.price_small > 0 && product.price_medium && product.price_medium > 0) 
            || (product.price_small && product.price_small > 0 && product.price_big && product.price_big > 0)" 
                class="font-bold text-lg pl-4 p-2 bg-white border-t text-neutral-800"
            >
                <span class="text-sm font-normal">a partir de </span>{{ formatMoney(product.price_small/100) }}
            </div>
            <div v-else-if="product.price_small && product.price_small > 0" 
                class="font-bold text-lg pl-4 p-2 bg-white border-t text-neutral-800"
            >
                {{ formatMoney(product.price_small/100) }}
            </div>
            <div v-else 
                class="font-bold text-lg pl-4 p-2 bg-white border-t text-neutral-800"
            >
                Gratuito
            </div>
        </div>
    </div>
</template>