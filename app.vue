<template>
  <naive-config>
    <n-notification-provider placement="bottom" :container-style="{}">
      <n-loading-bar-provider>
        <n-dialog-provider>
          <NuxtPage />
        </n-dialog-provider>
      </n-loading-bar-provider>
    </n-notification-provider>
  </naive-config>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.1s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>