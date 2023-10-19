<script setup lang="ts">
import type { Establishment } from '@/@types/api';
import { DownloadOutline } from '@vicons/ionicons5';
import Qrcode from 'qrcode.vue';

const props = defineProps<{
    establishment: Establishment,
    colorTheme: string
}>()

const runtimeConfig = useRuntimeConfig()
const APP_URL = runtimeConfig.public.appUrl
const downloadQrCode = () => {
  const canvas = document.querySelector('canvas') as HTMLCanvasElement
  const link = document.createElement('a')
  link.download = props.establishment?.link_name + '-qr-code-cardapio.ninja.png'
  link.href = canvas.toDataURL()
  link.click()
}
</script>

<template>
    <div class="w-full text-[12px] text-center px-4">
        <div class="bg-white rounded py-4">
            <p class="">Link do seu cardápio: <a :href="APP_URL+'/'+establishment.link_name" target="_blank" :class="'font-medium mb-3 text-['+colorTheme+']'">{{ APP_URL }}/{{ establishment.link_name }}</a></p>
            <p class="mt-2  ">QR Code do seu cardápio:</p>
            <div class="mb-2 p-1" >
                <Qrcode :margin="2" :size="150" :value="APP_URL+'/'+establishment.link_name" class="mx-auto"/>
            </div>
            <n-button type="info" size="large" :color="colorTheme" @click="downloadQrCode">
                <template #icon>
                    <n-icon><DownloadOutline class="animate-bounce" /></n-icon>
                </template>
                Baixar
            </n-button>
        </div>
    </div>
</template>