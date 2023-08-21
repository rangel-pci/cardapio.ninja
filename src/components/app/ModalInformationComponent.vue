<script setup lang="ts">
import type { InformationSection } from '@/types/EstablishmentManager';
import { Close, CloseCircle } from '@vicons/ionicons5';
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
    'update-informationSection-open',
    'update-informationSection-close',
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

        <!-- <label for="address">Horário de funcionamento</label> -->
        <div class="w-full rounded bg-gray-100 p-2">
          <n-collapse>
            <n-collapse-item title="Horário de funcionamento" name="1">
              <div v-for="day, index in daysOfWeek" :key="index">
                <div class="mt-1">{{day}}</div>
                <n-input-group class="text-center">
                  
                  <n-time-picker 
                    :value="informationSection.contact.open_close[index].open" 
                    @update:formatted-value="(formattedValue: string, value: number) => $emit('update-informationSection-open', value, index)"
                    format="HH:mm"
                    :show-icon="false"
                    input-readonly
                    placeholder="00:00"
                    :style="{width: '100%'}"
                    clearable
                  />
                  <div class="flex justify-center items-center bg-white border text-gray-500" :style="{width: '90px'}">às</div>
                  <n-time-picker 
                    :value="informationSection.contact.open_close[index].close" 
                    @update:formatted-value="(formattedValue: string, value: number) => $emit('update-informationSection-close', value, index)"
                    format="HH:mm"
                    :show-icon="false"
                    input-readonly
                    placeholder="00:00"
                    :style="{width: '100%'}"
                    clearable
                  />
                  <n-button type="error" secondary @click="$emit('update-informationSection-open', null, index), $emit('update-informationSection-close', null, index)">
                    <template #icon>
                      <n-icon><CloseCircle /></n-icon>
                    </template>
                  </n-button>
                </n-input-group>
              </div>
            </n-collapse-item>
          </n-collapse>
        </div>
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
</style>@/types/EstablishmentManager