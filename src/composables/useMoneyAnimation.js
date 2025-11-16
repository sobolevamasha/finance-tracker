import { ref } from 'vue'

export function useMoneyAnimation() {
  const showAnimation = ref(false)
  
  const triggerMoneyAnimation = () => {
    showAnimation.value = true
  }
  
  const hideMoneyAnimation = () => {
    showAnimation.value = false
  }
  
  return {
    showAnimation,
    triggerMoneyAnimation,
    hideMoneyAnimation
  }
}