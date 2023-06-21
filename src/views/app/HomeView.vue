<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ApiService } from '@/services/ApiService'
import { useLoadingBar, useNotification } from 'naive-ui';
import type { AxiosError } from 'axios';
import type { ResponseError, ResponseLogin } from '@/types/api'
import { useAuthStore } from '@/stores/user';
import router from '@/router';

const loading = useLoadingBar()
const isLoading = ref(false)
const notification = useNotification()

</script>

<template>
  <div class="bg-gray-200 min-h-screen flex justify-center items-center">
    minha área
  </div>
</template>