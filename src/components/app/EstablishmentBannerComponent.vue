<script setup lang="ts">
import type { Establishment } from '@/types/api';
import { Brush } from '@vicons/ionicons5';

defineProps<{
    establishment: Establishment,
    colorTheme: string,
    openModal: () => void,
}>()

</script>

<template>
   <div class="relative flex flex-row items-center justify-start gap-2 w-full h-40 md:h-60 max-w-6xl rounded-b-md overflow-hidden" id="banner-container">
      <img :src="establishment.banner" :alt="establishment.name" class="object-cover h-40 md:h-60 w-full absolute top-0 left-0 z-0 opacity-75">
      <img :src="establishment.image" :alt="establishment.name" class="ml-4 w-24 h-24 object-cover rounded-[100%] z-10">
      <h1 class="text-white text-2xl font-bold text-shadow uppercase z-10">{{ establishment.name.toUpperCase() }}</h1>
      
      <div class="absolute right-4 bottom-4">
        <n-button type="info" size="large" :color="colorTheme" @click="openModal">
          <template #icon>
            <n-icon><Brush class="animate-bounce" /></n-icon>
          </template>
          Editar
        </n-button>
      </div>
    </div>
</template>
