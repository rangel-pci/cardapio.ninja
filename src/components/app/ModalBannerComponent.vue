<script setup lang="ts">
import type { BannerSection } from '@/types/EstablishmentManager';
import { Close, HelpCircle } from '@vicons/ionicons5';
import type { UploadFileInfo } from 'naive-ui';
import { ref } from 'vue';

defineProps<{
    loading: boolean,
    show: boolean,
    bannerSection: BannerSection,
    handleImageBeforeUpload: (data: { file: UploadFileInfo } | null) => boolean,
    handleBannerBeforeUpload: (data: { file: UploadFileInfo } | null) => boolean,
    handleSave: (type: string, callback: Function | null) => void
}>()

const defaultBannerImages = [
  {title: 'Padrão 1', url: 'aaa'},
  {title: 'Padrão 2', url: 'bbb'},
  {title: 'Padrão 3', url: 'ccc'},
  {title: 'Padrão 4', url: 'ddd'},
  {title: 'Padrão 5', url: 'eee'},
  {title: 'Padrão 6', url: 'fff'},
]
const defaultBannerImage = ref(null)
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
          <div class="flex items-center gap-1">
            <label for="name">Banner Padrão</label>
            <n-tooltip trigger="hover" :style="{ maxWidth: '250px' }">
              <template #trigger>
                <n-icon class="hover:cursor-pointer" size="large">
                  <HelpCircle />
                </n-icon>
              </template>
              Caso não tenha um banner com a sua marca, você pode usar um dos nossos.
            </n-tooltip>
          </div>
          <n-radio-group v-model:value="defaultBannerImage" name="radiobuttongroup1">
            <n-radio-button
              v-for="bannerImage in defaultBannerImages.slice(0, 3)"
              :key="bannerImage.title"
              :value="bannerImage.url"
              :label="bannerImage.title"
              class="w-24"
            />
          </n-radio-group>
          <n-radio-group v-model:value="defaultBannerImage" name="radiobuttongroup2" class="mb-3">
            <n-radio-button
              v-for="bannerImage in defaultBannerImages.slice(3, 6)"
              :key="bannerImage.title"
              :value="bannerImage.url"
              :label="bannerImage.title"
              class="w-24"
            />
          </n-radio-group>
        
          <label for="name">Nome</label>
          <n-input
              class="mb-3"
              placeholder=""
              :value="bannerSection.name"
              @input="$emit('update-bannerSection-name', $event)"
          />
        </div>
      </form>
      
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
</style>@/types/EstablishmentManager