<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageLayout from '@/components/layout/PageLayout.vue'
import ProductCard from '@/components/products/ProductCard.vue'
import { fetchProducts, fetchFilters } from '@/api/products'

const route = useRoute()
const router = useRouter()

const products = ref([])
const brands = ref([])
const categories = ref([])
const loading = ref(true)
const error = ref('')

const selectedBrand = ref('')
const selectedCategory = ref('')
const selectedBadge = ref('')
const searchQuery = ref('')

async function loadFilters() {
  const { data } = await fetchFilters()
  brands.value = data.brands
  categories.value = data.categories
}

async function loadProducts() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await fetchProducts({
      brand: selectedBrand.value || undefined,
      category: selectedCategory.value || undefined,
      badge: selectedBadge.value || undefined,
      search: searchQuery.value || undefined,
    })
    products.value = data.products
  } catch {
    error.value = 'Не удалось загрузить каталог'
  } finally {
    loading.value = false
  }
}

function applyFromRoute() {
  selectedBrand.value = (route.query.brand ?? '') || ''
  selectedCategory.value = (route.query.category ?? '') || ''
  selectedBadge.value = (route.query.badge ?? '') || ''
  searchQuery.value = (route.query.q ?? '') || ''
}

function updateRoute() {
  const query = {}
  if (selectedBrand.value) query.brand = selectedBrand.value
  if (selectedCategory.value) query.category = selectedCategory.value
  if (selectedBadge.value) query.badge = selectedBadge.value
  if (searchQuery.value.trim()) query.q = searchQuery.value.trim()
  router.replace({ query })
}

function onFilterChange() {
  updateRoute()
  loadProducts()
}

function resetFilters() {
  selectedBrand.value = ''
  selectedCategory.value = ''
  selectedBadge.value = ''
  searchQuery.value = ''
  onFilterChange()
}

watch(() => route.query, () => {
  applyFromRoute()
  loadProducts()
})

onMounted(async () => {
  applyFromRoute()
  await loadFilters()
  await loadProducts()
})
</script>

<template>
  <PageLayout>
    <div class="catalog">
      <header class="catalog__head">
        <h1>Каталог</h1>
        <p>Музыкальные инструменты и студийное оборудование</p>
      </header>

      <div class="catalog__layout">
        <aside class="catalog__filters" aria-label="Фильтры товаров">
          <h2>Фильтры</h2>

          <label class="filter-field">
            <span>Поиск</span>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Название, бренд…"
              @keyup.enter="onFilterChange"
            />
          </label>

          <label class="filter-field">
            <span>Производитель</span>
            <select v-model="selectedBrand" @change="onFilterChange">
              <option value="">Все</option>
              <option v-for="b in brands" :key="b" :value="b">{{ b }}</option>
            </select>
          </label>

          <label class="filter-field">
            <span>Категория</span>
            <select v-model="selectedCategory" @change="onFilterChange">
              <option value="">Все</option>
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
          </label>

          <button type="button" class="filter-reset" @click="resetFilters">Сбросить</button>
        </aside>

        <section class="catalog__results">
          <p v-if="loading" class="catalog__status">Загрузка…</p>
          <p v-else-if="error" class="catalog__status catalog__status--error">{{ error }}</p>
          <p v-else-if="!products.length" class="catalog__status">Товары не найдены</p>

          <ul v-else class="product-grid">
            <li v-for="product in products" :key="product.id">
              <ProductCard :product="product" />
            </li>
          </ul>
        </section>
      </div>
    </div>
  </PageLayout>
</template>

<style scoped>
.catalog {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;
}

.catalog__head h1 {
  font-size: 1.75rem;
  margin-bottom: 0.35rem;
}

.catalog__head p {
  color: var(--color-text-muted);
  margin-bottom: 2rem;
}

.catalog__layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 2rem;
  align-items: start;
}

.catalog__filters {
  padding: 1.25rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  position: sticky;
  top: calc(var(--header-height) + 1rem);
}

.catalog__filters h2 {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.filter-field span {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.filter-field input,
.filter-field select {
  padding: 0.5rem 0.65rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.9rem;
}

.filter-field input:focus,
.filter-field select:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: -1px;
}

.filter-reset {
  width: 100%;
  padding: 0.5rem;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.filter-reset:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.catalog__status {
  color: var(--color-text-muted);
  padding: 2rem 0;
}

.catalog__status--error {
  color: var(--color-accent);
}

.product-grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
}

@media (max-width: 768px) {
  .catalog__layout {
    grid-template-columns: 1fr;
  }

  .catalog__filters {
    position: static;
  }
}
</style>
