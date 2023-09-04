<script setup lang="ts">
import { AddCircleOutline } from '@vicons/ionicons5';
import type { Module, Product } from '@/types/Api';
import ProductItem from './ProductItemComponent.vue';
import { TextToId } from '@/utils/TextToId';
import { computed } from 'vue';

const props = defineProps<{
    products: Product[],
    openModal: () => void,
    colorTheme: string,
    modules: Module[],
    onClickItem: (product: Product, module: Module | null) => void,
}>()

const getSorted = (modules: Module[]) => {
    return modules.sort((a, b) => a.order - b.order);
}

const getNonGroupedProducts = computed(() => {
    const nonGroupedProducts = props.products.filter(prod => !Array.prototype.concat(...props.modules.map(m => m.products_id )).includes(prod.id))
    nonGroupedProducts.sort((a, b) => a.name.localeCompare(b.name))
    return nonGroupedProducts
})

const getGroupedProducts = computed(() => {
    return (category: Module) => {
        const groupedProducts = props.products.filter(prod => category.products_id?.includes(prod.id))
        groupedProducts.sort((a, b) => a.name.localeCompare(b.name))
        return groupedProducts
    }
})
</script>

<template>
    <div class="w-full px-4 relative">
        <div class="bg-white p-4 flex flex-col" style="overflow-x: auto;">
            <n-button type="primary" class="self-end flex gap-1 py-4" @click="openModal">
                <template #icon>
                    <n-icon size="25"><AddCircleOutline /></n-icon>
                </template>
                Novo Produto
            </n-button>
            <p v-if="products.length === 0" class="text-gray-500 mt-4">Você ainda não adicionou nenhum produto.</p>

            <div class="flex flex-col gap-2 mt-4" v-if="products.length > 0">
                <template v-for="category in getSorted(modules)" :key="TextToId(category.title)">
                    <div class="border rounded p-2 bg-slate-100 mb-4">   
                        <h2 class="text-lg font-bold text-neutral-800 mb-2">{{ category.title }}</h2>
                        <div class="md:grid md:grid-cols-2 gap-2">
                            <template v-for="groupedProduct in getGroupedProducts(category)" :key="groupedProduct">
                                <ProductItem @click="onClickItem(groupedProduct, category)" :colorTheme="colorTheme" :product="groupedProduct"/>    
                            </template>
                        </div>
                    </div>
                </template>
                <div v-if="getNonGroupedProducts.length > 0" class="border rounded p-2 bg-slate-100 mb-4">
                    <h2 class="text-lg font-bold text-neutral-800 mb-2">Sem categoria</h2>
                    <div class="md:grid md:grid-cols-2 gap-2">
                        <template v-for="nonGroupedProduct in getNonGroupedProducts" :key="nonGroupedProduct.id">
                            <ProductItem @click="onClickItem(nonGroupedProduct, null)" :colorTheme="colorTheme" :product="nonGroupedProduct"/>    
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>