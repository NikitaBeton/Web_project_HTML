<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import ProductCard from '@/components/products/ProductCard.vue'
import { fetchProducts } from '@/api/products'
import { useFavoritesStore } from '@/stores/favorites'

const favorites = useFavoritesStore()
const { ids } = storeToRefs(favorites)

const allProducts = ref([])
const loading = ref(true)

const favoriteProducts = computed(() =>
  allProducts.value.filter((p) => ids.value.includes(p.id)),
)

onMounted(async () => {
  try {
    const { data } = await fetchProducts()
    allProducts.value = data.products
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="section">
    <h1>Избранное</h1>
    <p class="section__lead">Товары, которые вы сохранили</p>

    <p v-if="loading" class="empty">Загрузка…</p>
    <p v-else-if="!favoriteProducts.length" class="empty">
      Список избранного пуст. Добавляйте товары из каталога.
    </p>

    <ul v-else class="product-grid">
      <li v-for="product in favoriteProducts" :key="product.id">
        <ProductCard :product="product" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.section h1 {
  font-size: 1.5rem;
  margin-bottom: 0.35rem;
}

.section__lead {
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
}

.empty {
  color: var(--color-text-muted);
  padding: 2rem;
  text-align: center;
  border: 1px dashed var(--color-border);
  border-radius: 8px;
}

.product-grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}
</style>
