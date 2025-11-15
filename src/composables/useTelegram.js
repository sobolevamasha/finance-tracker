import { ref, onMounted } from 'vue'

export function useTelegram() {
  const tg = window.Telegram?.WebApp
  const isTelegram = ref(false)
  const user = ref(null)

  const init = () => {
    if (!tg) {
      console.log('Not in Telegram environment')
      return
    }

    isTelegram.value = true
    tg.expand() // Раскрываем на весь экран
    tg.enableClosingConfirmation() // Подтверждение закрытия
    
    // Получаем данные пользователя
    user.value = tg.initDataUnsafe?.user || {
      id: 123456789,
      first_name: 'Тестовый',
      last_name: 'Пользователь',
      username: 'test_user'
    }

    // Устанавливаем тему Telegram
    document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff')
    document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000')
    document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#999999')
    document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#2481cc')
    document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#2481cc')
    document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff')
    document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color || '#f4f4f5')

    console.log('Telegram WebApp initialized', user.value)
  }

  const showMainButton = (text, callback) => {
    if (!tg) return
    
    tg.MainButton.setText(text)
    tg.MainButton.onClick(callback)
    tg.MainButton.show()
  }

  const hideMainButton = () => {
    if (!tg) return
    tg.MainButton.offClick()
    tg.MainButton.hide()
  }

  const showAlert = (message) => {
    if (!tg) {
      alert(message)
      return
    }
    tg.showAlert(message)
  }

  const closeApp = () => {
    if (!tg) return
    tg.close()
  }

  onMounted(() => {
    // Даем время на инициализацию Telegram
    setTimeout(init, 100)
  })

  return {
    tg,
    isTelegram,
    user,
    showMainButton,
    hideMainButton,
    showAlert,
    closeApp
  }
}