<template>
  <div id="app" :class="{ 'telegram-app': isTelegram }">
    <router-view />
  </div>
</template>

<script setup>
import { useTelegram } from '@/composables/useTelegram'

const { isTelegram } = useTelegram()
</script>

<style lang="scss">
.telegram-app {
  // Специфичные стили для Telegram окружения
  background: var(--tg-theme-bg-color, #ffffff);
  color: var(--tg-theme-text-color, #000000);
  min-height: 100vh;
  
  .card {
    background: var(--tg-theme-secondary-bg-color, #f8f9fa);
  }
  
  .btn--primary {
    background: var(--tg-theme-button-color, #3498db);
    color: var(--tg-theme-button-text-color, #ffffff);
  }
}
</style>