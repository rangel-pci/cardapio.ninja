<script setup lang="ts">
import type { InformationSection } from '@/types/establishmentManager';
import { Close } from '@vicons/ionicons5';
import axios from 'axios';

  defineProps<{
    loading: boolean,
    show: boolean,
    colorTheme: string,
    informationSection: InformationSection,
    daysOfWeek: string[],
    handleSave: (type: string, callback: Function | null) => void
  }>()

  const emit = defineEmits([
    'update-informationSection-notice',
    'update-informationSection-address', 
    'update-informationSection-minimum_order', 
    'update-informationSection-telephone', 
    'update-informationSection-whatsapp', 
    'update-informationSection-open-close',
    'onClose'
  ])
  
  const getAddress = (cep: string) => {
    if(cep.length == 8){
      axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      .then(res => {
        let address = res.data.erro ? '' : `${res.data.logradouro ?? 'Não informado'}, ${res.data.bairro ?? 'Não informado'}, ${res.data.localidade ?? 'Não informado'}-${res.data.uf ?? 'Não informado'}`
        emit('update-informationSection-address', address)
      })
    }
  }
  const handleMask = {
    whatsApp: (value: string,) => {
      return handleMask.phone(value)
    },
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
    money: (value: string,) => {
      if(value.length > 15){return value.slice(0, -1)}
      let money = value.replace(/\D/g, '')
      money = money.replace(/(\d)(\d{2})$/, '$1,$2')
      money = money.replace(/(?=(\d{3})+(\D))\B/g, '.')
      money = money.replace(/^(\d)/g, 'R$ $1')
      return money
    },
    time: (value: string,) => {
      if(value.length > 5){return value.slice(0, -1)}
      let time = value.replace(/\D/g, '')
      if(time.length > 2){
        time = time.replace(/(\d{2})$/, ':$1')
      }
      return time
    }
  }
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
        <n-button secondary type="primary" size="small" @click="$emit('onClose')">
          <template #icon>
              <n-icon><Close /></n-icon>
          </template>
      </n-button>
      </template>

      <p :class="'mb-3 text-[12px] text-['+colorTheme+'] bg-gray-100 p-2 rounded'">📣 Para ocultar um campo deixe-o em branco.</p>

      <form @submit.prevent>
        <label for="notice">Aviso</label>
        <n-input
          class="mb-3"
          placeholder=""
          clearable
          :value="informationSection.notice"
          @input="$emit('update-informationSection-notice', $event)"
        ><template #prefix><span class="opacity-25">💬</span></template></n-input>
        
        <label for="minimum_order">Pedido Mínimo</label>
        <n-input
          class="mb-3"
          placeholder=""
          clearable
          :input-props="{ inputmode:'numeric' }"
          :value="informationSection.minimum_order"
          @input="$emit('update-informationSection-minimum_order', handleMask.money($event))"
        ><template #prefix><span class="opacity-25">💲</span></template></n-input>
        
        <label for="telephone">Telefone</label>
        <n-input
          class="mb-3"
          placeholder=""
          clearable
          :input-props="{ inputmode:'numeric' }"
          :value="informationSection.contact.telephone"
          @input="$emit('update-informationSection-telephone', handleMask.telephone($event))"
        ><template #prefix><span class="opacity-25">📞</span></template></n-input>
        
        <label for="whatsApp">WhatsApp</label>
        <n-input
          class="mb-3"
          placeholder=""
          clearable
          :input-props="{ inputmode:'numeric' }"
          :value="informationSection.contact?.whatsapp"
          @input="$emit('update-informationSection-whatsapp', handleMask.whatsApp($event))"
        ><template #prefix><span class="opacity-25">🗨</span></template></n-input>
        
        <label for="address">Endereço</label>
        <n-input
          class="mb-3"
          placeholder="CEP"
          clearable
          :input-props="{ inputmode:'numeric' }"
          @input="getAddress"
          maxlength="8"
        ><template #prefix><span class="opacity-25"></span></template></n-input>
        <n-input
          class="mb-3"
          placeholder=""
          type="textarea"
          rows="2"
          clearable
          :value="informationSection.contact.address"
          @input="$emit('update-informationSection-address', $event)"
        ><template #prefix><span class="opacity-25">📍</span></template></n-input>

        <label for="address">Horário de funcionamento</label>
        <n-input-group v-for="day, index in daysOfWeek" :key="index">
          <n-input-group-label :style="{width: '100px'}">{{day}}</n-input-group-label>
          <n-input
            :value="[informationSection.contact.open_close[index].open,informationSection.contact.open_close[index].close]" 
            @input="$emit('update-informationSection-open-close', handleMask.time($event[0]), handleMask.time($event[1]), index)"
            :placeholder="['00:00', '00:00']" pair clearable separator="às" :input-props="{ inputmode:'numeric' }"
          />
        </n-input-group>
      </form>
      
      <template #footer>
        <div class="flex justify-end gap-2">
          <n-button type="primary" @click="handleSave('information', () => $emit('onClose'))" :loading="loading">Salvar</n-button>
          <n-button type="primary" ghost @click="$emit('onClose')">Cancelar</n-button>
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