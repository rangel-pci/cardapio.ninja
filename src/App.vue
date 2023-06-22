<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <n-loading-bar-provider>
    <n-notification-provider placement="bottom-left">
      <suspense>
        <RouterView />
      </suspense>
    </n-notification-provider>
  </n-loading-bar-provider>
</template>
