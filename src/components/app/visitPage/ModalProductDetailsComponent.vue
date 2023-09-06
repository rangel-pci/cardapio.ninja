<script setup lang="ts">
import { Cart, Close } from '@vicons/ionicons5'
import type { Product } from '@/types/Api'
import { ref, watch } from 'vue';
import { useCartStore } from '../../../stores/visitPage/CartStore';

const props = defineProps<{
  show: boolean,
  colorTheme: string,
  targetProduct: Product | null,
}>()

const emit = defineEmits([
  'onClose'
])

const cartStore = useCartStore()
const size = ref<'small' | 'medium' | 'big' | null>(null)
const sizeOptions = ref<{ label: string, value: 'small' | 'medium' | 'big' }[]>([
  { label: 'Pequeno', value: 'small' },
  { label: 'Médio', value: 'medium' },
  { label: 'Grande', value: 'big' },
])
const quantity = ref(1)

const formatMoney = (value: number) => {
  return value.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
}

watch(() => props.show, (value) => {
  if(value){
    quantity.value = 1
    if(props.targetProduct?.price_small && props.targetProduct?.price_medium && props.targetProduct?.price_big){
      size.value = 'small'
      sizeOptions.value = [
        { label: 'Pequeno ' + formatMoney(props.targetProduct.price_small/100), value: 'small' },
        { label: 'Médio ' + formatMoney(props.targetProduct.price_medium/100), value: 'medium' },
        { label: 'Grande ' + formatMoney(props.targetProduct.price_big/100), value: 'big' },
      ]
    }else if(props.targetProduct?.price_medium && props.targetProduct?.price_big){
      size.value = 'medium'
    }else if(props.targetProduct?.price_big){
      size.value = 'big'
    }else{
      size.value = null
    }
  }
})

watch(() => quantity.value, (value) => {
  if(value < 1){
    quantity.value = 1
  }
})

const getPrice = () => {
  if(size.value === 'small' || size.value === null){
    return props.targetProduct?.price_small ?? 0
  }else if(size.value === 'medium'){
    return props.targetProduct?.price_medium ?? 0
  }else if(size.value === 'big'){
    return props.targetProduct?.price_big ?? 0
  }else{
    return 0
  }
}

const handleSubmit = () => {
  if(!props.targetProduct){
    return
  }
  cartStore.addProduct(
    props.targetProduct,
    quantity.value,
    size.value,
  )
  emit('onClose')
}
</script>

<template>
  <n-modal :show="props.show">
  <div
    v-if="props.targetProduct"
    style="width: 600px"
    class="rounded bg-white flex flex-col pb-[190px]"
    aria-modal="true"
  >
    <div class="p-2 text-right">
      <n-button secondary type="error" size="small" @click="emit('onClose')">
        Fechar
        <template #icon>
          <n-icon><Close /></n-icon>
        </template>
      </n-button>
    </div>

    <div class="border-t">
      <div class="w-full h-72 md:w-80 md:h-80 mx-auto">
        <img :src="targetProduct?.image" alt="imagem do produto" class="w-full h-full object-contain md:object-cover">
      </div>

      <h3 class="text-2xl pt-2 font-bold px-2 text-neutral-800 border-t">{{ props.targetProduct.name }}</h3>
      <p class="mt-4 px-2 text-neutral-600 pb-2">{{ props.targetProduct.description }}</p>
    </div>

    <div class="w-full fixed bottom-0 overflow-hidden left-0 right-0 flex justify-center bg-white md:bg-transparent">
      <div class="text-right flex flex-col pt-4 w-full max-w-[600px] md:mx-2 border-t md:bg-white md:mb-4 md:rounded-b">
        <div v-if="size" class="px-4 md:px-2 flex">
          <n-input-group class="md:max-w-[300px] mx-auto">
            <div :class="`bg-[${colorTheme}] text-white flex items-center justify-center px-2 rounded`" style="max-width: 100px;">
              Tamanho
            </div>
            <n-select v-model:value="size" :options="sizeOptions" :color="colorTheme" size="large" />
          </n-input-group>
        </div>
        <div class="pt-2 px-4 md:px-2 flex">
          <n-input-group class="md:max-w-[300px] mx-auto">
            <div :class="`bg-[${colorTheme}] text-white flex items-center justify-center px-2 rounded`" style="max-width: 100px;">
              Quantidade
            </div>
            <n-button type="error" @click="quantity >= 2 ? quantity-- : null" size="large" style="width: 24%;">
              -
            </n-button>
            <n-input-number size="large" v-model:value="quantity" :show-button="false" style="text-align: center;"/>
            <n-button size="large" type="primary" :color="colorTheme" @click="quantity++" style="width: 24%;">
              +
            </n-button>
          </n-input-group>
        </div>
        <div class="p-4 md:p-2 flex mt-4">          
          <n-button type="primary" @click="handleSubmit" :color="colorTheme" size="large" class="flex-1">
            <template #icon>
              <n-icon><Cart /></n-icon>
            </template>
            <p class="text-white">Adicionar <span class="font-semibold text-lg">{{ formatMoney((getPrice() / 100) * quantity) }}</span></p>
          </n-button>
        </div>
      </div>
    </div>  
  </div>
</n-modal>
</template>

<style scoped>
.n-modal{
  max-width: 95vw;
}
</style>