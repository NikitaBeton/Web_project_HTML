import { ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'musik_shop_orders'

function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref(loadOrders())

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders.value))
  }

  function createFromCart(cartItems) {
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      status: 'В обработке',
      items: cartItems.map((i) => ({ ...i })),
      total: cartItems.reduce((s, i) => s + i.price * i.quantity, 0),
    }
    orders.value.unshift(order)
    persist()
    return order
  }

  return { orders, createFromCart }
})
