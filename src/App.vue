<script setup lang="ts">
import { datePtBR, ptBR } from 'naive-ui';
import { RouterView } from 'vue-router'
</script>

<template>
  <n-config-provider :locale="ptBR" :date-locale="datePtBR">
    <n-notification-provider placement="bottom" :container-style="{}">
      <n-loading-bar-provider>
        <n-dialog-provider>
          <suspense>
            <RouterView />
          </suspense>
        </n-dialog-provider>
      </n-loading-bar-provider>
    </n-notification-provider>
  </n-config-provider>
</template>
