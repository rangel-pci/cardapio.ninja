<script setup lang="ts">
import type { Establishment } from '@/types/api';
import { Brush } from '@vicons/ionicons5';

defineProps<{
    establishment: Establishment,
    openModal: () => void,
    isOpen: boolean,
    minimumOrderAmount: string,
    phone: string,
    daysOfWeek: string[],
    colorTheme: string,
}>()
</script>

<template>
    <div class="w-full text-[12px] text-center px-4 relative">
        <div class="bg-white p-4 rounded">
            <div class="flex gap-1 justify-center flex-wrap">
                <span class="font-medium">⏰{{isOpen ? 'Aberto agora' :'Fechado'}}</span>
                <span class="font-medium" v-if="minimumOrderAmount">💲Pedido min. {{minimumOrderAmount}}</span>
                <span class="font-medium" v-if="phone">📞{{ phone }}</span>
            </div>
            <div class="font-medium mt-1" v-if="establishment.store.notice">💬{{ establishment.store.notice }}</div>

            <div class="absolute right-8 -bottom-4 z-10">
                <n-button type="info" size="large" :color="colorTheme" @click="openModal">
                    <template #icon>
                        <n-icon><Brush class="animate-bounce" /></n-icon>
                    </template>
                    Editar
                </n-button>
            </div>
        </div>

        <div class="mt-1 w-full px-4 bg-white text-left rounded p-2">
            <n-collapse>
                <n-collapse-item :title="(!isOpen ? 'Endereço e horário de funcionamento':'Mais informações')" name="1">
                    <n-divider title-placement="left" dashed>
                        Horário
                    </n-divider>
                    <div v-for="state, index in establishment.store.contact?.open_close" :key="index">
                        <span v-if="state.open && state.close"><div class="font-bold w-[70px] inline-block">{{daysOfWeek[index]}}:</div> 
                            {{("0" + new Date(state.open).getHours()).slice(-2)}}:{{("0" + new Date(state.open).getMinutes()).slice(-2)}}
                            às 
                            {{("0" + new Date(state.close).getHours()).slice(-2)}}:{{("0" + new Date(state.close).getMinutes()).slice(-2)}}
                        </span>
                        <span v-else><div class="font-bold w-[70px] inline-block">{{daysOfWeek[index]}}:</div> Fechado</span>
                    </div>
                    
                    <div v-if="establishment.store.contact?.address">
                        <n-divider title-placement="left" dashed>
                            Endereço
                        </n-divider>
                        <div>{{ establishment.store.contact?.address }}</div>
                    </div>
                </n-collapse-item>
            </n-collapse>
        </div>
    </div>
</template>

<style scoped>
.n-divider{
    margin: 0.8rem auto;
}
.n-collapse-item__content-inner{
    padding-top: 0.1rem;
}
</style>