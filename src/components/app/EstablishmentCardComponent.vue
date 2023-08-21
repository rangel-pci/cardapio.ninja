<script setup lang="ts">
import type { Establishment } from '@/types/Api';
import { Brush } from '@vicons/ionicons5';

    defineProps<{
        establishment?: Establishment,
        loading?: boolean | undefined
    }>()
</script>

<template>
    <n-card  v-if="loading" class="max-w-[250px] mx-4 mt-8">
        <n-space vertical>
            <n-skeleton height="150px" width="100%" />
            <n-skeleton height="20px" width="50%" />
            <n-skeleton height="25px" width="100%" />
        </n-space>
    </n-card>
    <n-card v-else-if="establishment"  class="max-w-[250px] mx-4 mt-8">
        <template #cover>
            <img :src="establishment.image" :alt="establishment.name" class="mx-auto" loading="lazy">
        </template>     
        
        <h2 class="text-center mt-4 font-bold">{{establishment.name}}</h2>       
        
        <router-link :to="{ name:'manage-establishment', params: {id: establishment.id} }" class="flex justify-center mt-3">
            <n-button type="primary" class="flex-1">
                <template #icon>
                    <n-icon>
                    <Brush />
                    </n-icon>
                </template>
                Gerenciar
            </n-button>
        </router-link>
    </n-card>
</template>@/types/API@/types/Api