<script setup lang="ts">
import type { InformationSection } from '@/types/establishmentManager';
import { Close } from '@vicons/ionicons5';

  defineProps<{
      loading: boolean,
      show: boolean,
      colorTheme: string,
      informationSection: InformationSection,
      handleSave: (type: string) => void
  }>()
</script>


<template>
    <n-modal :show="show">
    <n-card
      style="width: 600px"
      title="Editando informações"
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

      <p :class="'mb-3 text-[12px] text-['+colorTheme+']'">📣 Para ocultar um campo no seu cardápio, deixe-o em branco.</p>

      <form @submit.prevent>
        <label for="notice">Aviso</label>
        <n-input
          class="mb-3"
          placeholder=""
        ><template #prefix><span class="opacity-25">💬</span></template></n-input>
        
        <label for="minimum_order">Pedido Mínimo</label>
        <n-input
          class="mb-3"
          placeholder=""
          type="number"
        ><template #prefix><span class="opacity-25">💲</span></template></n-input>

      </form>
      
      <template #footer>
        <div class="flex justify-end gap-2">
          <n-button type="primary" @click="handleSave('information')" :loading="loading">Salvar</n-button>
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