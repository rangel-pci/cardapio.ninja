<script setup lang="ts">
import { NIcon } from 'naive-ui';
import { Menu, PersonCircle, ListCircle, LogOutOutline } from '@vicons/ionicons5'

const runtimeConfig = useRuntimeConfig()
const APP_NAME = runtimeConfig.public.appName
const authStore = useAuthStore()
const router = useRouter()
const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}
const handleMenuSelect = (path: string) => {
  if (path === '/app/logout') {
    authStore.removeToken()
    router.push({ path: '/app/login' })
    return
  }
  router.push({ path })
}
const options = [
  {
    label: 'Meus cardápios',
    key: '/app/minha-area',
    icon: renderIcon(ListCircle)
  },  
  {
    label: 'Minha conta',
    key: '/app/minha-area/minha-conta',
    icon: renderIcon(PersonCircle)
  },
  {
    label: 'Sair',
    key: '/app/logout',
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
</template>