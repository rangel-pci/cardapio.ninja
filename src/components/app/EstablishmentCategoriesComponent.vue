<script setup lang="ts">
import type { Module } from '@/types/Api'
import { TextToId } from '@/utils/TextToId'
import { Brush } from '@vicons/ionicons5';

defineProps<{
    modules: Module[] | undefined,
    openModal?: () => void,
    colorTheme: string,
    visitPage?: boolean
}>()

const scrollToElement = (id: string) => {
    const el = document.getElementById(id)
    if(el){
        const y = el.getBoundingClientRect().top + window.scrollY - 80
        window.scrollTo({top: y, behavior: 'smooth'})
    }
}
</script>

<template>
    <div class="w-full px-4 relative">
        <div :class="`bg-white p-4 flex gap-2  ${visitPage ? 'shadow-md shadow-neutral-300 border' : ''}`" style="overflow-x: auto;">
            <template v-for="category in modules" :key="TextToId(category.title)">
                <div class="rounded">
                
                <n-button secondary :color="colorTheme" @click="scrollToElement(TextToId(category.title))">
                    {{ category.title }}
                </n-button>
                </div>
            </template>
        </div>

        <div v-if="openModal" class="hidden md:block absolute right-8 -bottom-4 z-10">
            <n-button type="info" size="large" :color="colorTheme" @click="openModal">
                <template #icon>
                    <n-icon><Brush class="animate-bounce" /></n-icon>
                </template>
                Editar
            </n-button>
        </div>
    </div>
</template>