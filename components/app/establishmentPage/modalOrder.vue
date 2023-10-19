<script setup lang="ts">
import { Cart, Close, LogoWhatsapp } from '@vicons/ionicons5';
import type { Establishment } from '@/@types/api';
import type { viaCepResponseType } from '@/@types/viaCep'

const props = defineProps<{
  show: boolean,
  colorTheme: string,
  establishment: Establishment
}>()

const cartStore = useCartStore()
const deliveryInfo = cartStore.deliveryInfo

defineEmits([
  'onClose'
])

const getAddress = (cep: string) => {
  if(cep.length == 8){
    useFetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(res => {
      const viacep = res.data.value as viaCepResponseType
      let address = res.error.value ? '' : `${viacep.logradouro ?? 'Não informado'}, ${viacep.bairro ?? 'Não informado'}, ${viacep.localidade ?? 'Não informado'}-${viacep.uf ?? 'Não informado'}`
      deliveryInfo.address = address
    })
  }
}
const handleMask = {
  telephone: (value: string,) => {
    return handleMask.phone(value)
  },
  phone:(value: string,) => {
    if(value.length > 15){return value.slice(0, -1)}
    let phone = value.replace(/\D/g, '')
    phone = phone.replace(/^(\d{2})(\d)/g, '($1) $2')
    phone = phone.replace(/(\d)(\d{4})$/, '$1-$2')
    return phone
  },
}

const makeOrder = () => {
  if(!props.establishment.store.contact?.whatsapp){
    alert('O estabelecimento não possui um whatsapp cadastrado')
    return
  }
  if(deliveryInfo.name == '' || deliveryInfo.phone == '' || deliveryInfo.cep == '' || deliveryInfo.address == '' || deliveryInfo.number == null){
    alert('Preencha o endereço para continuar')
    return
  }

  cartStore.saveDeliveryInfo(deliveryInfo)
  const whatsAppOrder = cartStore.mountWhatsAppOrder(props.establishment)
  const urlMessage = encodeURI(whatsAppOrder);
  var wppLink = `https://api.whatsapp.com/send?phone=+55${props.establishment.store.contact?.whatsapp}&text=${urlMessage}`;
  window.open(wppLink, '_blank');
}
</script>

<template>
  <div>
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
          <!-- <h3 class="text-center font-bold text-lg text-neutral-600">Seu carrinho</h3> -->
          <div class="px-4">
            <n-tabs type="card" animated>
              <n-tab-pane name="cartTab" tab="Carrinho">
                <div class="p-4 font-medium overflow-y-scroll max-h-[70vh] border rounded">
                  <div v-for="item, index in cartStore.cartItems" :key="item.product.id + '' + index" class="mb-2 rounded overflow-hidden">
                    <div class="flex border rounded-t overflow-hidden">
                      <div class="">
                        <NuxtImg :src="item.product.image" alt="imagem do produto" class="w-24 h-24 object-cover md:object-cover"/>
                      </div>
                      <div class="flex flex-col px-2 flex-1">
                        <span class="font-bold text-lg">{{ item.product.name }}</span>
                        <span>Tam: {{ item.size == 'small' ? 'Pequeno' : item.size == 'medium' ? 'Médio' : item.size == 'big' ? 'Grande' : 'Normal' }}</span>
                        <span>Preço: {{ formatMoneyBRL(item.getUnitPrice(item.size, item.product)) }}</span>
                        <span>Total: <span :class="`font-bold text-[${colorTheme}]`">{{ item.getUnitPrice(item.size, item.product) > 0 ? formatMoneyBRL(item.getUnitPrice(item.size, item.product) * item.quantity) : 'Gratuito' }}</span></span>
                      </div>
                    </div>
                    <div class="flex border-x border-b rounded-b">
                      <n-input-group class="md:max-w-[300px] justify-center">
                        <!-- <button :class="`bg-red-500 text-white flex items-center justify-center px-2`" @click="item.quantity >= 2 ? item.quantity-- : cartStore.removeProduct(item.product, item.size)" style="width: 100px;">
                          -
                        </button> -->
                        <n-button secondary type="primary" @click="item.quantity >= 2 ? item.quantity-- : cartStore.removeProduct(item.product, item.size)" style="width: 30%;">
                          -
                        </n-button>
                        <n-input-number v-model:value="item.quantity" :show-button="false" style="text-align: center;width: 40%;"/>
                        <!-- <button :class="`bg-[${colorTheme}] text-white flex items-center justify-center px-2`" @click="item.quantity++" style="width: 100px;">
                          +
                        </button> -->
                        <n-button secondary type="primary" @click="item.quantity++" style="width: 30%;">
                          +
                        </n-button>
                      </n-input-group>
                    </div>
                  </div>
                </div>
              </n-tab-pane>
              <n-tab-pane name="addressTab" tab="Endereço de Entrega">
                <div class="p-4 font-medium overflow-y-scroll max-h-[70vh] border rounded">
                  <label for="name">Nome</label>
                  <n-input
                    class="mb-3"
                    placeholder="Seu nome"
                    clearable
                    v-model:value="deliveryInfo.name"
                  ></n-input>
                  <label for="name">Telefone</label>
                  <n-input
                  class="mb-3"
                  placeholder=""
                  clearable
                  :input-props="{ inputmode:'numeric' }"
                  v-model:value="deliveryInfo.phone"
                  @input="deliveryInfo.phone = handleMask.telephone($event)"
                  ></n-input>
                  <label for="cep">CEP</label>
                  <n-input
                    class="mb-3"
                    placeholder="CEP"
                    clearable
                    v-model:value="deliveryInfo.cep"
                    :input-props="{ inputmode:'numeric' }"
                    @input="getAddress"
                    maxlength="8"
                  ></n-input>
                  <label for="address">Endereço</label>
                  <n-input
                    class="mb-3"
                    placeholder="Seu endereço completo"
                    type="textarea"
                    rows="3"
                    clearable
                    v-model:value="deliveryInfo.address"
                  ></n-input>
                  <label for="number">Número</label>
                  <n-input
                    class="mb-3"
                    placeholder="Número da casa/lote/apartamento"
                    clearable
                    v-model:value="deliveryInfo.number"
                    :input-props="{ inputmode:'numeric' }"
                  ></n-input>
                  <label for="note">Observação</label>
                  <n-input
                    class="mb-3"
                    placeholder="Observação"
                    type="textarea"
                    rows="2"
                    clearable
                    v-model:value="deliveryInfo.note"
                  ></n-input>
                </div>
              </n-tab-pane>
            </n-tabs>

            <div class="flex flex-col justify-center gap-2 mt-2">
              <p :class="`rounded text-[${colorTheme}] border text-lg font-bold text-center`">Total: {{ formatMoneyBRL(cartStore.cartTotal) }}</p>
              <n-button type="primary" size="large" @click="makeOrder">
                <n-icon class="mr-2" size="medium"><LogoWhatsapp /></n-icon> Enviar Pedido
              </n-button>
            </div>
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
  </div>
</template>

<style scoped>
.n-modal{
  max-width: 95vw;
}
</style>