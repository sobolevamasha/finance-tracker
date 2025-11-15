<template>
  <div class="container">
    <div class="header" v-if="user">
      <h1>💰 Финансовый Трекер</h1>
      <div class="user-info">
        <span>Привет, {{ user.first_name }}!</span>
      </div>
    </div>
    <h1 v-else class="text-center">💰 Финансовый Трекер</h1>
    
    <div class="balance-card">
      <div class="balance-label">Текущий баланс</div>
      <div class="balance-amount" :class="balanceAmountClass">
        {{ formattedBalance }}
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Доходы</div>
        <div class="stat-amount text-success">+{{ formattedIncome }} ₽</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Расходы</div>
        <div class="stat-amount text-danger">-{{ formattedExpenses }} ₽</div>
      </div>
    </div>

    <button class="btn btn--primary btn--block btn--lg" @click="showTransactionForm">
      + Добавить операцию
    </button>

    <div class="card">
      <div class="card-header">
        <h3>Последние операции</h3>
        <button class="btn btn--text" @click="exportData" v-if="isTelegram">
          📤 Экспорт
        </button>
      </div>
      <div class="transactions-list">
        <div 
          v-for="transaction in recentTransactions" 
          :key="transaction.id" 
          class="transaction-item list-item--interactive"
          @click="editTransaction(transaction)"
        >
          <div class="transaction-info">
            <div class="transaction-description">{{ transaction.description }}</div>
            <div class="transaction-category">{{ getCategoryLabel(transaction.category) }}</div>
            <div class="transaction-date">{{ formatDate(transaction.date) }}</div>
          </div>
          <div class="transaction-amount" :class="transactionAmountClass(transaction)">
            {{ formatAmount(transaction.amount) }}
          </div>
        </div>
        
        <div v-if="transactions.length === 0" class="empty-state">
          <p>📝 Пока нет операций</p>
          <p class="text-muted">Добавьте первую операцию!</p>
        </div>
      </div>
    </div>

    <TransactionForm 
      :visible="showForm"
      :editing-transaction="editingTransaction"
      @close="closeForm"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTransactions } from '@/stores/useTransactions'
import { storeToRefs } from 'pinia'
import { useTelegram } from '@/composables/useTelegram'
import TransactionForm from '@/components/TransactionForm.vue'

const transactionStore = useTransactions()
const { transactions, totalBalance } = storeToRefs(transactionStore)
const { isTelegram, user, showMainButton, hideMainButton, showAlert } = useTelegram()

const showForm = ref(false)
const editingTransaction = ref(null)

const categories = {
  food: '🍕 Еда',
  transport: '🚕 Транспорт', 
  shopping: '🛍️ Шоппинг',
  entertainment: '🎬 Развлечения',
  health: '🏥 Здоровье',
  bills: '🏠 Коммунальные',
  salary: '💰 Зарплата',
  freelance: '💼 Фриланс',
  other: '📦 Другое'
}

// Форматированные значения
const formattedBalance = computed(() => {
  return new Intl.NumberFormat('ru-RU').format(totalBalance.value)
})

const formattedIncome = computed(() => {
  return new Intl.NumberFormat('ru-RU').format(totalIncome.value)
})

const formattedExpenses = computed(() => {
  return new Intl.NumberFormat('ru-RU').format(totalExpenses.value)
})

const balanceAmountClass = computed(() => ({
  'balance-amount--positive': totalBalance.value >= 0,
  'balance-amount--negative': totalBalance.value < 0
}))

const totalIncome = computed(() => {
  return transactions.value
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalExpenses = computed(() => {
  return Math.abs(transactions.value
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0))
})

const recentTransactions = computed(() => {
  return [...transactions.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10)
})

// Методы
const showTransactionForm = () => {
  editingTransaction.value = null
  showForm.value = true
}

const editTransaction = (transaction) => {
  editingTransaction.value = transaction
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingTransaction.value = null
}

const getCategoryLabel = (category) => {
  return categories[category] || categories.other
}

const transactionAmountClass = (transaction) => ({
  'transaction-amount--income': transaction.amount > 0,
  'transaction-amount--expense': transaction.amount < 0
})

const formatAmount = (amount) => {
  return `${amount > 0 ? '+' : ''}${new Intl.NumberFormat('ru-RU').format(amount)} ₽`
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const exportData = () => {
  const data = transactions.value.map(t => ({
    Дата: t.date,
    Описание: t.description,
    Категория: getCategoryLabel(t.category),
    Сумма: t.amount,
    Тип: t.amount > 0 ? 'Доход' : 'Расход'
  }))
  
  const csv = [
    'Дата,Описание,Категория,Сумма,Тип',
    ...data.map(row => 
      `"${row.Дата}","${row.Описание}","${row.Категория}",${row.Сумма},"${row.Тип}"`
    )
  ].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `финансы_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  
  showAlert('Данные экспортированы в CSV файл!')
}

// Инициализация Telegram кнопки
onMounted(() => {
  if (isTelegram) {
    showMainButton('Добавить операцию', showTransactionForm)
  }
})
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
  
  h1 {
    margin-bottom: 0;
  }
}

.user-info {
  font-size: $font-size-sm;
  color: $text-muted;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
  
  h3 {
    margin-bottom: 0;
  }
}

.btn--text {
  background: transparent;
  color: $primary-color;
  padding: $spacing-sm;
  
  &:hover {
    background: rgba($primary-color, 0.1);
  }
}

.transaction-date {
  font-size: $font-size-xs;
  color: $text-muted;
  margin-top: $spacing-xs;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
}

.stat-card {
  background: $card-bg;
  padding: $spacing-md;
  border-radius: $border-radius-sm;
  text-align: center;
  box-shadow: $shadow-sm;
}

.stat-label {
  font-size: $font-size-sm;
  color: $text-muted;
  margin-bottom: $spacing-xs;
}

.stat-amount {
  font-weight: 600;
  font-size: $font-size-lg;
}

.empty-state {
  text-align: center;
  padding: $spacing-xl;
  color: $text-muted;
}

.transactions-list {
  max-height: 400px;
  overflow-y: auto;
}
</style>