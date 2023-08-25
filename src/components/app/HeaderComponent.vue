<script setup lang="ts">
import { h, type Component } from 'vue';
import { NIcon, } from 'naive-ui';
import router from '@/router';
import { Menu, PersonCircle, ListCircle, LogOutOutline } from '@vicons/ionicons5'
import { useAuthStore } from '@/stores/AuthStore';

const APP_NAME = import.meta.env.VITE_APP_NAME
const authStore = useAuthStore()
const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}
const handleMenuSelect = (name: string) => {
  if (name === 'logout') {
    authStore.removeToken()
    router.push({ name: 'login' })
    return
  }
  router.push({ name })
}
const options = [
  {
    label: 'Meus cardápios',
    key: 'my-area',
    icon: renderIcon(ListCircle)
  },  
  {
    label: 'Minha conta',
    key: 'my-account',
    icon: renderIcon(PersonCircle)
  },
  {
    label: 'Sair',
    key: 'logout',
    icon: renderIcon(LogOutOutline)
  }
]

</script>

<template>
  <div class="p-4 bg-white">
    <n-page-header :subtitle="APP_NAME">
      <!-- <template #title>
        <h1>Meus Cardápios</h1>
      </template> -->
      <template #extra>
        <n-dropdown trigger="click" :options="options" @select="handleMenuSelect">
          <n-button type="primary" secondary>
            <template #icon>
              <n-icon><Menu /></n-icon>
            </template>
          </n-button>
        </n-dropdown>
      </template>
    </n-page-header>
  </div>
</template>@/stores/AuthStore