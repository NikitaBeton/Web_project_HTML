import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const STORAGE_KEY = 'musik_shop_favorites'

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const auth = useAuthStore()
  const ids = ref([])

  const count = computed(() => ids.value.length)

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.value))
  }

  function syncWithAuth() {
    if (!auth.initialized) return

    if (auth.isAuthenticated) {
      ids.value = loadFavorites()
    } else {
      ids.value = []
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  watch(
    () => [auth.initialized, auth.isAuthenticated],
    syncWithAuth,
    { immediate: true },
  )

  function isFavorite(productId) {
    return auth.isAuthenticated && ids.value.includes(productId)
  }

  function toggle(productId) {
    if (!auth.isAuthenticated) return false

    if (isFavorite(productId)) {
      ids.value = ids.value.filter((id) => id !== productId)
    } else {
      ids.value.push(productId)
    }
    persist()
    return true
  }

  function remove(productId) {
    if (!auth.isAuthenticated) return false

    ids.value = ids.value.filter((id) => id !== productId)
    persist()
    return true
  }

  return { ids, count, isFavorite, toggle, remove }
})
