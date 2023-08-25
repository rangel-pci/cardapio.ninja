<script setup lang="ts">
import { AddCircleOutline } from '@vicons/ionicons5';
import type { Product } from '@/types/Api';

defineProps<{
    products: Product[],
    openModal: () => void,
    colorTheme: string,
}>()
</script>

<template>
    <div class="w-full px-4 relative">
        <div class="bg-white p-4 flex flex-col items-center" style="overflow-x: auto;">
            <n-button type="primary" class="self-end flex gap-1 py-4" @click="openModal">
                <template #icon>
                    <n-icon size="25"><AddCircleOutline /></n-icon>
                </template>
                Novo Produto
            </n-button>
            <p v-if="products.length === 0" class="text-gray-500 mt-4">Você ainda não adicionou nenhum produto.</p>

            <div class="flex gap-2 mt-4" v-if="products.length > 0">
                <template v-for="product in products.filter((p, i) => i < 3)" :key="product.id">
                    <n-card :title="product.name">
                        <template #cover>
                        <img :src="product.image">
                        </template>
                        {{ product.description }}
                    </n-card>
                </template>
            </div>
        </div>
    </div>
</template>