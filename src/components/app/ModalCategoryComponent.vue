<script setup lang="ts">
import { AddCircleOutline, ArrowDownOutline, ArrowUpOutline, Close, RemoveCircleOutline } from '@vicons/ionicons5';
import type { Module } from '@/types/Api'
import { ref, watch } from 'vue';
import { DeepClone } from '@/utils/DeepClone';

const props = defineProps<{
  loading: boolean,
  show: boolean,
  colorTheme: string,
  modules: Module[],
  handleSave: (type: string, callback: Function | null) => void
}>()

const emit = defineEmits([
  'update-establishment-modules',
  'onClose'
])

const modules = ref<Module[]>(DeepClone(props.modules as []))
modules.value.sort((a, b) => a.order - b.order)

watch(() => props.show, (value) => {
  if(value){
    modules.value = DeepClone(props.modules as [])
    modules.value.sort((a, b) => a.order - b.order)
  }
})

const onCreate = (index: number) => {
  modules.value = modules.value.slice(0, index)
  .concat({
    order: index,
    title: '',
    text: '',
    products_id: [],
  })
  .concat(modules.value.slice(index, modules.value.length))
}
const onRemove = (index: number) => {
  modules.value.splice(index, 1)
} 
const onMove = (type: 'up' | 'down', index: number) => {
  if(type === 'up'){
    if(index === 0) return
    const temp = modules.value[index - 1]
    temp.order = index
    modules.value[index - 1] = modules.value[index]
    modules.value[index - 1].order = index - 1
    modules.value[index] = temp
  }else{
    if(index === modules.value.length - 1) return
    const temp = modules.value[index + 1]
    temp.order = index
    modules.value[index + 1] = modules.value[index]
    modules.value[index + 1].order = index + 1
    modules.value[index] = temp
  }
}
const handleSubmit = () => {
  modules.value = modules.value.filter(module => module.title)
  modules.value.forEach((module, index) => module.order = index)
  emit('update-establishment-modules', modules.value)
  props.handleSave('modules', () => emit('onClose'))
}
</script>

<template>
  <n-modal :show="props.show">
  <n-card
    style="width: 600px"
    title="Editando categorias"
    preset="dialog"
    aria-modal="true"
  >
    <template #header-extra>
      <n-button secondary type="primary" size="small" @click="emit('onClose')">
        <template #icon>
            <n-icon><Close /></n-icon>
        </template>
    </n-button>
    </template>

    <form @submit.prevent>
      <n-dynamic-input
        :value="modules"
        @update="$emit('update-establishment-modules', $event)"
        :on-create="onCreate"
      >
        <template #default="{value}">
          <n-input
            placeholder="Nome da categoria"
            v-model:value="value.title"
            clearable
          ></n-input>
        </template>
        <template #action="{ index }">
          <div class="px-2"></div>
          <div class="ml-auto">
            <n-input-group>
              <n-button @click="() => onRemove(index)">
                <n-icon>
                  <RemoveCircleOutline />
                </n-icon>
              </n-button>
              <n-button @click="() => onCreate(index + 1)" title="Criar nova categoria">
                <n-icon>
                  <AddCircleOutline />
                </n-icon>
              </n-button>
              <n-button @click="() => onMove('up', index)" :disabled="index === 0">
                <n-icon>
                  <ArrowUpOutline />
                </n-icon>
              </n-button>
              <n-button @click="() => onMove('down', index)" :disabled="index === modules.length -1">
                <n-icon>
                  <ArrowDownOutline />
                </n-icon>
              </n-button>
            </n-input-group>
          </div>
        </template>
      </n-dynamic-input>
      <!-- <pre>{{ JSON.stringify(modules, null, 2) }}</pre> -->
    </form>
    
    <template #footer>
      <div class="flex justify-end gap-2">
        <n-button type="primary" @click="handleSubmit" :loading="loading">Salvar</n-button>
        <n-button type="primary" ghost @click="emit('onClose')">Cancelar</n-button>
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