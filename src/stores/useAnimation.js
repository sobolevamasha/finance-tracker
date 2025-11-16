import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAnimationStore = defineStore('animation', () => {
  const showMoneyAnimation = ref(false)
  
  const triggerMoneyAnimation = () => {
    console.log('🎯 triggerMoneyAnimation вызван!')
    showMoneyAnimation.value = true
    console.log('🎯 showMoneyAnimation установлен в:', showMoneyAnimation.value)
    
    setTimeout(() => {
      console.log('🎯 Скрываем анимацию')
      showMoneyAnimation.value = false
    }, 3000)
  }
  
  return {
    showMoneyAnimation,
    triggerMoneyAnimation
  }
})