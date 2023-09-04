<script setup lang="ts">
import type { BannerSection } from '@/types/EstablishmentManager';
import { Close } from '@vicons/ionicons5';
import type { UploadFileInfo } from 'naive-ui';

defineProps<{
    loading: boolean,
    show: boolean,
    bannerSection: BannerSection,
    handleImageBeforeUpload: (data: { file: UploadFileInfo } | null) => boolean,
    handleBannerBeforeUpload: (data: { file: UploadFileInfo } | null) => boolean,
    handleSave: (type: string, callback: Function | null) => void
}>()
</script>


<template>
    <n-modal :show="show">
    <n-card
      style="width: 600px"
      title="Editando apresentação"
      preset="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button secondary type="primary" size="small" @click="$emit('close')">
          <template #icon>
              <n-icon><Close /></n-icon>
          </template>
      </n-button>
      </template>
      
      <form @submit.prevent>
        <div class="flex gap-4">
          <label for="logo">Logomarca
            <n-upload
              @before-upload="handleImageBeforeUpload"
              @remove="handleImageBeforeUpload(null)"
              list-type="image-card"
              :max="1"
              :default-upload="false"
              accept="image/png, image/jpeg, image/jpg"
              class="mb-3"
            >
              Selecionar logo 1:1
            </n-upload>
          </label>

          <label for="banner">Banner Customizado
            <n-upload
              @before-upload="handleBannerBeforeUpload"
              @remove="handleBannerBeforeUpload(null)"
              list-type="image-card"
              :max="1"
              :default-upload="false"
              accept="image/png, image/jpeg, image/jpg"
              class="mb-3"
            >
              Selecionar banner 16:9
            </n-upload>
          </label>
        </div>

        <div class="flex flex-col">        
          <label for="name">Nome</label>
          <n-input
              class="mb-3"
              placeholder=""
              :value="bannerSection.name"
              @input="$emit('update-bannerSection-name', $event)"
          />
        </div>
      </form>
      {{ JSON.stringify(bannerSection)  }}
      
      <template #footer>
        <div class="flex justify-end gap-2">
          <n-button type="primary" @click="handleSave('banner', () => $emit('close'))" :loading="loading">Salvar</n-button>
          <n-button type="primary" ghost @click="$emit('close')">Cancelar</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>
.n-modal{
  max-width: 95vw;
}
</style>