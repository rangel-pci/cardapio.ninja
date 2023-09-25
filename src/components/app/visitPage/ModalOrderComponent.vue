<script setup lang="ts">
import { useCartStore } from '@/stores/visitPage/CartStore';
import { FormatMoneyBRL } from '@/utils/FormatMoneyBRL';
import { Cart, Close } from '@vicons/ionicons5';

const props = defineProps<{
  show: boolean,
  colorTheme: string,
}>()

const cartStore = useCartStore()

defineEmits([
  'onClose'
])
</script>

<template>
  <n-modal :show="props.show">
    <div
      style="width: 600px"
      class="rounded bg-white flex flex-col pb-8"
      aria-modal="true"
    >
      <div class="p-2 text-right">
        <n-button secondary type="error" size="small" @click="$emit('onClose')">
          Fechar
          <template #icon>
            <n-icon><Close /></n-icon>
          </template>
        </n-button>
      </div>

      <template v-if="cartStore.cartItems.length > 0">
        <h3 class="text-center font-bold text-lg text-neutral-600">Seu carrinho</h3>

        <div class="mt-2 mx-4 font-medium">
          <div v-for="item, index in cartStore.cartItems" :key="item.product.id + '' + index" class="mb-2 rounded overflow-hidden">
            <div class="flex border rounded-t overflow-hidden">
              <div class="">
                <img :src="item.product.image" alt="imagem do produto" class="w-24 h-24 object-cover md:object-cover">
              </div>
              <div class="flex flex-col px-2 flex-1">
                <span class="font-bold text-lg">{{ item.product.name }}</span>
                <span>Tam: {{ item.size == 'small' ? 'Pequeno' : item.size == 'medium' ? 'Médio' : item.size == 'big' ? 'Grande' : 'Normal' }}</span>
                <span>Preço: {{ FormatMoneyBRL(item.getUnitPrice(item.size, item.product)) }}</span>
                <span>Total: <span :class="`font-bold text-[${colorTheme}]`">{{ item.getUnitPrice(item.size, item.product) > 0 ? FormatMoneyBRL(item.getUnitPrice(item.size, item.product) * item.quantity) : 'Gratuito' }}</span></span>
              </div>
            </div>
            <div class="flex border-x border-b rounded-b">
              <n-input-group class="max-w-[300px]">
                <button :class="`bg-red-500 text-white flex items-center justify-center px-2`" @click="item.quantity >= 2 ? item.quantity-- : cartStore.removeProduct(item.product, item.size)" style="width: 100px;">
                  -
                </button>
                <n-input-number v-model:value="item.quantity" :show-button="false" style="text-align: center;max-width: 100px;"/>
                <button :class="`bg-[${colorTheme}] text-white flex items-center justify-center px-2`" @click="item.quantity++" style="width: 100px;">
                  +
                </button>
              </n-input-group>
            </div>
          </div>
        </div>
        <p :class="`rounded text-[${colorTheme}] border text-lg font-bold mx-4 text-center`">Total: {{ FormatMoneyBRL(cartStore.cartTotal) }}</p>

        <h3 class="text-center font-bold text-lg text-neutral-600 mt-8">Dados para entrega</h3>

        <div class="mx-4 mt-2">
          
        </div>
      </template>
      <template v-else>
        <div class="flex justify-center items-center gap-2">
          <h3 class="text-center font-bold text-lg text-neutral-600">Carrinho vazio</h3>
          <n-icon size="32" class="text-neutral-500"><Cart /></n-icon>
        </div>
      </template>
    </div>
  </n-modal>
</template>

<style scoped>
.n-modal{
  max-width: 95vw;
}
</style>