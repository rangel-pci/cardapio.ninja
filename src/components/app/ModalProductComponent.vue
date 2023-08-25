<script setup lang="ts">
import { Close } from '@vicons/ionicons5';
import type { Product, Module } from '@/types/Api'
import { ref, watch } from 'vue';
import type { UploadFileInfo } from 'naive-ui';
import type { ProductFormData } from '@/types/Product'
import { useNotification } from 'naive-ui';

type TargetProduct = Omit<Product, 'price_small' | 'price_medium' | 'price_big'> & {
  price_small: string,
  price_medium: string,
  price_big: string,
}
const props = defineProps<{
  loading: boolean,
  show: boolean,
  colorTheme: string,
  targetProduct: Product | null,
  targetModule: Module | null,
  modules: Module[],
  handleSave: (
    productFormData: ProductFormData, 
    moduleName: string,
    targetProduct: Product | null, 
    targetModule: Module | null,  
    callback: Function | null
  ) => void
}>()

const emit = defineEmits([
  'update-establishment-modules',
  'onClose'
])

const productFileImage = ref<File | null>(null)
const notification = useNotification()

const handleMaskMoney = (value: string) => {
  value.replace(/\D/g, '')
  if(value.length > 15){return value.slice(0, -1)}
    let money = value.replace(/\D/g, '')
    money = money.replace(/(\d)(\d{2})$/, '$1,$2')
    money = money.replace(/(?=(\d{3})+(\D))\B/g, '.')
    money = money.replace(/^(\d)/g, 'R$ $1')
    return money
}

const module_name = ref<string>('')
const product = ref<TargetProduct>({
  id: props.targetProduct?.id || 0,
  name: props.targetProduct?.name || '',
  image: props.targetProduct?.image || '',
  description: props.targetProduct?.description || '',
  price_small: props.targetProduct?.price_small ? handleMaskMoney(props.targetProduct?.price_small+'') : '',
  price_medium: props.targetProduct?.price_medium ? handleMaskMoney(props.targetProduct?.price_medium+'') : '',
  price_big: props.targetProduct?.price_big ? handleMaskMoney(props.targetProduct?.price_big+'') : '',
})
const categoriesList = ref<{label: string, value: string}[]>([])

watch(() => props.show, (value) => {
  if(value){
    categoriesList.value = props.modules.map(module => {return {label: module.title, value: module.title}})
    categoriesList.value.unshift({label: 'Nenhuma', value: ''})
  }
})

const handleImageBeforeUpload = (data: { file: UploadFileInfo } | null) => {
  if(!data){productFileImage.value = null; return true }

  const file = data.file.file
  if(!file){
    return false
  }

  if(file.type != 'image/jpeg' && file.type != 'image/png'){
    notification.error({
      content: 'Erro',
      meta: 'Formato de imagem inválido',
    })
    return false
  }
  if(file.size > 2000000){
    notification.error({
      content: 'Erro',
      meta: 'Tamanho máximo de imagem é 2MB',
    })
    return false
  }

  productFileImage.value = file
  return true
}

const handleSubmit = () => {
  if(product.value.id == 0 && !productFileImage.value){
    alert('O campo "Foto" é obrigatório.')
    return
  }
  if(!product.value.name){
    alert('O campo "Nome" é obrigatório.')
    return
  }

  const formData:ProductFormData = {
    image: productFileImage.value,
    dontReplaceImage: !productFileImage.value,
    name: product.value.name,
    description: product.value.description,
    price_small: product.value.price_small ? parseInt(product.value.price_small.replace(/\D/g, '')) : 0,
    price_medium: product.value.price_medium ? parseInt(product.value.price_medium.replace(/\D/g, '')) : 0,
    price_big: product.value.price_big ?  parseInt(product.value.price_big.replace(/\D/g, '')) : 0,
  }

  // console.log(formData)
  props.handleSave(formData, module_name.value, props.targetProduct, props.targetModule,() => emit('onClose'))
}
</script>

<template>
  <n-modal :show="props.show">
  <n-card
    style="width: 600px"
    :title="props.targetProduct?.name || 'Adicionar produto'"
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

    <p :class="'mb-3 text-[12px] text-['+colorTheme+'] bg-gray-100 p-2 rounded'">
      📣 Para ocultar um campo deixe-o em branco.<br>
      <span class="text-red-500">*</span> Campo obrigatório, não pode ser deixado em branco.
    </p>

    <form @submit.prevent>
      <label for="photo">Foto do Produto
        <n-upload
          @before-upload="handleImageBeforeUpload"
          @remove="handleImageBeforeUpload(null)"
          list-type="image-card"
          :max="1"
          :default-upload="false"
          accept="image/png, image/jpeg, image/jpg"
          class="mb-3"
        >
          Selecionar foto 1:1
        </n-upload>
      </label>

      <label for="name">Nome <span class="text-red-500">*</span></label>
      <n-input
        class="mb-3"
        placeholder="Nome do produto"
        clearable
        v-model:value="product.name"
      ></n-input>

      <label for="description">Descrição</label>
      <n-input
        class="mb-3"
        placeholder="Descrição do produto"
        type="textarea"
        rows="2"
        clearable
        v-model:value="product.description"
      ></n-input>

      <label for="category">Categoria</label>
      <n-select class="mb-3" id="category" v-model:value="module_name" :options="categoriesList" />
      
      <label >Valor <span :class="'text-[12px] text-['+colorTheme+']'">(Preencha apenas o campo "Pequeno" para um preço fixo)</span></label>
      <n-input-group>
        <n-input-group-label :style="{ width: '80px' }">Pequeno</n-input-group-label>
        <n-input
          placeholder=""
          clearable
          :input-props="{ inputmode:'numeric' }"
          :value="product.price_small"
          @input="product.price_small = handleMaskMoney($event)"
        ></n-input>
      </n-input-group>
      <n-input-group>
        <n-input-group-label :style="{ width: '80px' }">Médio</n-input-group-label>
        <n-input
          placeholder=""
          clearable
          :value="product.price_medium"
          @input="product.price_medium = handleMaskMoney($event)"
        ></n-input>
      </n-input-group>
      <n-input-group>
        <n-input-group-label :style="{ width: '80px' }">Grande</n-input-group-label>
        <n-input
          class="mb-3"
          placeholder=""
          clearable
          :value="product.price_big"
          @input="product.price_big = handleMaskMoney($event)"
        ></n-input>
      </n-input-group>
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