import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'musik_shop_favorites'

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref(loadFavorites())

  const count = computed(() => ids.value.length)

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.value))
  }

  function isFavorite(productId) {
    return ids.value.includes(productId)
  }

  function toggle(productId) {
    if (isFavorite(productId)) {
      ids.value = ids.value.filter((id) => id !== productId)
    } else {
      ids.value.push(productId)
    }
    persist()
  }

  function remove(productId) {
    ids.value = ids.value.filter((id) => id !== productId)
    persist()
  }

  return { ids, count, isFavorite, toggle, remove }
})
