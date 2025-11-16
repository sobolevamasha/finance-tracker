<template>
  <div id="app" :class="{ 'telegram-app': isTelegram }">
    
    <div v-if="showMoneyAnimation" class="money-animation-container">
      <div 
        v-for="emoji in emojis" 
        :key="emoji.id"
        class="money-emoji"
        :style="emoji.style"
      >
        {{ emoji.symbol }}
      </div>
    </div>
    <router-view />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTelegram } from '@/composables/useTelegram'
import { useAnimationStore } from '@/stores/useAnimation'

const { isTelegram } = useTelegram()
const animationStore = useAnimationStore()
const { showMoneyAnimation } = storeToRefs(animationStore)

const symbols = ['💰', '💵', '💸', '💎', '💳']

// Пересоздаем эмодзи при каждом показе анимации
const emojis = computed(() => {
  console.log('🎯 emojis computed, showMoneyAnimation:', showMoneyAnimation.value)
  
  if (!showMoneyAnimation.value) return []
  
  const items = []
  for (let i = 0; i < 35; i++) {
    items.push({
      id: i,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      style: {
        left: Math.random() * 100 + 'vw',
        animationDelay: (Math.random() * 2) + 's',
        animationDuration: (2 + Math.random()) + 's'
      }
    })
  }
  console.log('🎯 Создано эмодзи:', items.length)
  return items
})

// Следим за изменениями
watch(showMoneyAnimation, (newVal) => {
  console.log('🎯 showMoneyAnimation изменилось на:', newVal)
})
</script>

<style>
.money-animation-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10000;
  background: transparent;
}

.money-emoji {
  position: absolute;
  font-size: 2rem;
  animation: floatUp 3s ease-in forwards;
  opacity: 0;
  padding: 5px;
}

@keyframes floatUp {
  0% {
    transform: translateY(100vh) rotate(0deg) scale(0.5);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg) scale(1.2);
    opacity: 0;
  }
}
</style>