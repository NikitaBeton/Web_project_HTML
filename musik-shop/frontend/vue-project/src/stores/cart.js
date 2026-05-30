import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'musik_shop_cart'

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref(loadCart())

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  )

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  }

  function add(product, quantity = 1) {
    const existing = items.value.find((i) => i.id === product.id)
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock)
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        category: product.category,
        stock: product.stock,
        imageUrl: product.imageUrl,
        quantity: Math.min(quantity, product.stock),
      })
    }
    persist()
  }

  function remove(productId) {
    items.value = items.value.filter((i) => i.id !== productId)
    persist()
  }

  function setQuantity(productId, quantity) {
    const item = items.value.find((i) => i.id === productId)
    if (!item) return
    if (quantity <= 0) {
      remove(productId)
      return
    }
    item.quantity = Math.min(quantity, item.stock)
    persist()
  }

  function clear() {
    items.value = []
    persist()
  }

  return { items, totalItems, totalPrice, add, remove, setQuantity, clear }
})
