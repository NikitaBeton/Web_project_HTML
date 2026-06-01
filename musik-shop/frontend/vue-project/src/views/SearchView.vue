<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageLayout from '@/components/layout/PageLayout.vue'
import ProductCard from '@/components/products/ProductCard.vue'
import { fetchProducts } from '@/api/products'

const route = useRoute()
const router = useRouter()

const query = ref('')
const products = ref([])
const loading = ref(false)
const searched = ref(false)
const error = ref('')

async function runSearch() {
  const q = query.value.trim()
  if (!q) {
    products.value = []
    searched.value = false
    router.replace({ path: '/search' })
    return
  }

  loading.value = true
  error.value = ''
  searched.value = true

  router.replace({ path: '/search', query: { q } })

  try {
    const { data } = await fetchProducts({ search: q })
    products.value = data.products
  } catch {
    error.value = 'Не удалось выполнить поиск'
    products.value = []
  } finally {
    loading.value = false
  }
}

function applyFromRoute() {
  query.value = (route.query.q ?? '') || ''
  if (query.value.trim()) {
    runSearch()
  } else {
    products.value = []
    searched.value = false
  }
}

watch(() => route.query.q, applyFromRoute)

onMounted(applyFromRoute)
</script>

<template>
  <PageLayout>
    <div class="search-page">
      <header class="search-page__head">
        <h1>Поиск товаров</h1>
        <p>Найдите инструменты по названию, бренду или категории</p>
      </header>

      <form class="search-form" role="search" @submit.prevent="runSearch">
        <label for="search-page-input" class="visually-hidden">Поисковый запрос</label>
        <input
          id="search-page-input"
          v-model="query"
          type="search"
          placeholder="Например: гитара, Fender, Boss…"
          autocomplete="off"
        />
        <button type="submit" class="search-form__btn" :disabled="loading">
          {{ loading ? 'Поиск…' : 'Найти' }}
        </button>
      </form>

      <section class="search-results" aria-live="polite">
        <p v-if="!searched" class="search-results__hint">
          Введите запрос и нажмите «Найти»
        </p>

        <p v-else-if="loading" class="search-results__status">Ищем…</p>

        <p v-else-if="error" class="search-results__status search-results__status--error">
          {{ error }}
        </p>

        <template v-else>
          <p class="search-results__count">
            По запросу «{{ route.query.q }}» найдено: {{ products.length }}
            {{ products.length === 1 ? 'товар' : products.length < 5 ? 'товара' : 'товаров' }}
          </p>

          <p v-if="!products.length" class="search-results__empty">
            Ничего не найдено. Попробуйте другое слово или
            <router-link to="/catalog">перейдите в каталог</router-link>.
          </p>

          <ul v-else class="product-grid">
            <li v-for="product in products" :key="product.id">
              <ProductCard :product="product" />
            </li>
          </ul>
        </template>
      </section>
    </div>
  </PageLayout>
</template>

<style scoped>
.search-page {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;
}

.search-page__head {
  margin-bottom: 1.5rem;
}

.search-page__head h1 {
  font-size: 1.75rem;
  margin-bottom: 0.35rem;
}

.search-page__head p {
  color: var(--color-text-muted);
}

.search-form {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  max-width: 640px;
}

.search-form input {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg);
  color: var(--color-text);
}

.search-form input:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: -1px;
}

.search-form__btn {
  padding: 0.75rem 1.5rem;
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-weight: 600;
  border-radius: 8px;
  white-space: nowrap;
}

.search-form__btn:disabled {
  opacity: 0.7;
  cursor: wait;
}

.search-form__btn:hover:not(:disabled) {
  background: var(--color-accent-hover);
}

.search-results__hint,
.search-results__status {
  color: var(--color-text-muted);
  padding: 2rem 0;
}

.search-results__status--error {
  color: var(--color-accent);
}

.search-results__count {
  margin-bottom: 1.25rem;
  font-size: 0.95rem;
  color: var(--color-text-muted);
}

.search-results__empty {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
  border: 1px dashed var(--color-border);
  border-radius: 8px;
}

.search-results__empty a {
  color: var(--color-accent);
  font-weight: 600;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

@media (max-width: 640px) {
  .search-page {
    padding: 1.5rem var(--page-padding-x) 2.5rem;
  }

  .search-form {
    flex-direction: column;
    max-width: none;
  }

  .search-form__btn {
    width: 100%;
  }

}
</style>
