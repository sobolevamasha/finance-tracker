<template>
  <div class="transaction-form-overlay" v-if="visible" @click.self="close">
    <div class="transaction-form card">
      <h2>{{ editingTransaction ? 'Редактировать' : 'Добавить' }} операцию</h2>
      
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label class="form-label">Тип операции</label>
          <div class="type-toggle">
            <button 
              type="button"
              class="type-btn" 
              :class="{ 'type-btn--active': form.type === 'income' }"
              @click="form.type = 'income'"
            >
              📥 Доход
            </button>
            <button 
              type="button"
              class="type-btn" 
              :class="{ 'type-btn--active': form.type === 'expense' }"
              @click="form.type = 'expense'"
            >
              📤 Расход
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Сумма</label>
          <input 
            type="number" 
            class="form-input" 
            placeholder="0"
            v-model="form.amount"
            required
          >
        </div>

        <div class="form-group">
          <label class="form-label">Категория</label>
          <select class="form-input" v-model="form.category">
            <option value="">Выберите категорию</option>
            <option v-for="category in categories" :key="category.value" :value="category.value">
              {{ category.label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Описание</label>
          <input 
            type="text" 
            class="form-input" 
            placeholder="Например: Обед в кафе"
            v-model="form.description"
          >
        </div>

        <div class="form-group">
          <label class="form-label">Дата</label>
          <input 
            type="date" 
            class="form-input" 
            v-model="form.date"
          >
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn--danger" @click="close">Отмена</button>
          <button type="submit" class="btn btn--primary">
            {{ editingTransaction ? 'Обновить' : 'Добавить' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useTransactions } from '../stores/useTransactions'

const props = defineProps({
  visible: Boolean,
  editingTransaction: Object
})

const emit = defineEmits(['close'])

const transactionStore = useTransactions()

const form = ref({
  type: 'expense',
  amount: '',
  category: '',
  description: '',
  date: new Date().toISOString().split('T')[0]
})

const categories = computed(() => [
  { value: 'food', label: '🍕 Еда' },
  { value: 'transport', label: '🚕 Транспорт' },
  { value: 'shopping', label: '🛍️ Шоппинг' },
  { value: 'entertainment', label: '🎬 Развлечения' },
  { value: 'health', label: '🏥 Здоровье' },
  { value: 'bills', label: '🏠 Коммунальные' },
  { value: 'salary', label: '💰 Зарплата' },
  { value: 'freelance', label: '💼 Фриланс' },
  { value: 'other', label: '📦 Другое' }
])

watch(() => props.editingTransaction, (transaction) => {
  if (transaction) {
    form.value = {
      type: transaction.amount > 0 ? 'income' : 'expense',
      amount: Math.abs(transaction.amount),
      category: transaction.category,
      description: transaction.description,
      date: transaction.date
    }
  } else {
    resetForm()
  }
})

const resetForm = () => {
  form.value = {
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  }
}

const submitForm = () => {
  const amount = form.value.type === 'income' 
    ? +form.value.amount 
    : -Math.abs(+form.value.amount)

  const transactionData = {
    amount,
    category: form.value.category || 'other',
    description: form.value.description || 'Без описания',
    date: form.value.date
  }

  if (props.editingTransaction) {
    // Редактирование существующей транзакции
    transactionStore.updateTransaction(props.editingTransaction.id, transactionData)
  } else {
    // Добавление новой транзакции
    transactionStore.addTransaction(transactionData)
  }

  close()
}

const close = () => {
  resetForm()
  emit('close')
}
</script>

<style scoped lang="scss">
.transaction-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $spacing-md;
}

.transaction-form {
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  background: $card-bg;
  border-radius: $border-radius;
  box-shadow: $shadow-lg;
  padding: $spacing-lg;
}

.type-toggle {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
}

.type-btn {
  flex: 1;
  padding: $spacing-md;
  border: 2px solid $border-color;
  border-radius: $border-radius-sm;
  background: white;
  transition: all 0.2s ease;
  
  &--active {
    border-color: $primary-color;
    background: $primary-color;
    color: white;
  }
}

.form-actions {
  display: flex;
  gap: $spacing-md;
  margin-top: $spacing-xl;
  
  .btn {
    flex: 1;
  }
}
</style>