import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTransactions = defineStore('transactions', () => {
  const transactions = ref([
    { id: 1, amount: -1500, category: 'food', description: 'Обед в кафе', date: '2024-01-15' },
    { id: 2, amount: 50000, category: 'salary', description: 'Зарплата', date: '2024-01-10' },
    { id: 3, amount: -300, category: 'transport', description: 'Такси', date: '2024-01-15' }
  ])

  const addTransaction = (transaction) => {
    transactions.value.push({
      id: Date.now(),
      ...transaction
    })
  }

  const deleteTransaction = (id) => {
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  const totalBalance = computed(() => {
    return transactions.value.reduce((sum, t) => sum + t.amount, 0)
  })

  const updateTransaction = (id, updatedData) => {
  const index = transactions.value.findIndex(t => t.id === id)
  if (index !== -1) {
    transactions.value[index] = { ...transactions.value[index], ...updatedData }
  }
}

const getTransactionById = (id) => {
  return transactions.value.find(t => t.id === id)
}

  return {
    transactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
  getTransactionById,
  totalBalance
  }
})