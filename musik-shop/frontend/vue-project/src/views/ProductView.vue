<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import PageLayout from '@/components/layout/PageLayout.vue'
import ProductReviews from '@/components/products/ProductReviews.vue'
import { fetchProduct } from '@/api/products'
import { formatPrice } from '@/utils/formatPrice'
import { useCartStore } from '@/stores/cart'
import { useFavoritesStore } from '@/stores/favorites'

const route = useRoute()
const cart = useCartStore()
const favorites = useFavoritesStore()

const product = ref(null)
const loading = ref(true)
const error = ref('')
const quantity = ref(1)
const activeSlide = ref(0)
const showFullInfo = ref(false)
const addedMessage = ref('')

const slides = computed(() => {
  if (!product.value?.images?.length) return []
  return product.value.images.map((src, index) => ({
    src,
    label: `Фото ${index + 1}`,
  }))
})

async function loadProduct() {
  loading.value = true
  error.value = ''
  product.value = null
  quantity.value = 1
  activeSlide.value = 0
  showFullInfo.value = false

  try {
    const { data } = await fetchProduct(route.params.id)
    product.value = data.product
  } catch {
    error.value = 'Товар не найден'
  } finally {
    loading.value = false
  }
}

function changeQuantity(delta) {
  if (!product.value) return
  quantity.value = Math.max(1, Math.min(product.value.stock, quantity.value + delta))
}

function addToCart() {
  if (!product.value) return
  cart.add(product.value, quantity.value)
  addedMessage.value = 'Товар добавлен в корзину'
  setTimeout(() => { addedMessage.value = '' }, 2500)
}

watch(() => route.params.id, loadProduct)
onMounted(loadProduct)
</script>

<template>
  <PageLayout>
    <div class="product-page">
      <RouterLink to="/catalog" class="product-page__back">← Назад в каталог</RouterLink>

      <p v-if="loading" class="product-page__status">Загрузка…</p>
      <p v-else-if="error" class="product-page__status product-page__status--error">{{ error }}</p>

      <article v-else-if="product" class="product-detail">
        <div class="product-detail__gallery">
          <div class="gallery__slide">
            <img
              v-if="slides[activeSlide]"
              :src="slides[activeSlide].src"
              :alt="`${product.name} — ${slides[activeSlide].label}`"
              class="gallery__img"
            />
            <span class="gallery__label">{{ slides[activeSlide]?.label }}</span>
          </div>
          <div v-if="slides.length > 1" class="gallery__dots">
            <button
              v-for="(slide, i) in slides"
              :key="slide.src"
              type="button"
              class="gallery__dot"
              :class="{ 'gallery__dot--active': i === activeSlide }"
              :aria-label="slide.label"
              @click="activeSlide = i"
            />
          </div>
        </div>

        <div class="product-detail__info">
          <p v-if="product.badge" class="product-detail__badge">{{ product.badge }}</p>
          <p class="product-detail__brand">{{ product.brand }}</p>
          <h1>{{ product.name }}</h1>
          <p class="product-detail__price">{{ formatPrice(product.price) }}</p>
          <p class="product-detail__stock">
            {{ product.stock > 0 ? `В наличии: ${product.stock} шт.` : 'Нет в наличии' }}
          </p>

          <p class="product-detail__desc">{{ product.description }}</p>

          <button type="button" class="product-detail__more" @click="showFullInfo = !showFullInfo">
            {{ showFullInfo ? 'Скрыть подробности' : 'Полная информация' }}
          </button>

          <div v-if="showFullInfo" class="product-detail__specs">
            <dl>
              <div><dt>Категория</dt><dd>{{ product.category }}</dd></div>
              <div><dt>Производитель</dt><dd>{{ product.brand }}</dd></div>
              <div><dt>Артикул</dt><dd>MS-{{ product.id.toString().padStart(4, '0') }}</dd></div>
            </dl>
          </div>

          <div class="product-detail__buy">
            <div class="quantity">
              <button type="button" aria-label="Уменьшить" @click="changeQuantity(-1)">−</button>
              <span>{{ quantity }}</span>
              <button type="button" aria-label="Увеличить" @click="changeQuantity(1)">+</button>
            </div>

            <button
              type="button"
              class="btn-cart"
              :disabled="product.stock === 0"
              @click="addToCart"
            >
              В корзину
            </button>

            <button
              type="button"
              class="btn-fav"
              :class="{ 'btn-fav--active': favorites.isFavorite(product.id) }"
              @click="favorites.toggle(product.id)"
            >
              {{ favorites.isFavorite(product.id) ? 'В избранном' : 'В избранное' }}
            </button>
          </div>

          <p v-if="addedMessage" class="product-detail__added">{{ addedMessage }}</p>
        </div>
      </article>

      <ProductReviews v-if="product" :product-id="product.id" />
    </div>
  </PageLayout>
</template>

<style scoped>
.product-page {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;
}

.product-page__back {
  display: inline-block;
  color: var(--color-accent);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.product-page__back:hover {
  text-decoration: underline;
}

.product-page__status {
  color: var(--color-text-muted);
  padding: 2rem 0;
}

.product-page__status--error {
  color: var(--color-accent);
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  align-items: start;
}

.product-detail__gallery {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
}

.gallery__slide {
  aspect-ratio: 4 / 3;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
}

.gallery__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  flex: 1;
  min-height: 0;
}

.gallery__label {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.gallery__dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
}

.gallery__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-border);
  padding: 0;
}

.gallery__dot--active {
  background: var(--color-accent);
}

.product-detail__badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.product-detail__brand {
  color: var(--color-accent);
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.product-detail h1 {
  font-size: 1.75rem;
  margin-bottom: 0.75rem;
  line-height: 1.25;
}

.product-detail__price {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
}

.product-detail__stock {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}

.product-detail__desc {
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.product-detail__more {
  background: none;
  border: none;
  color: var(--color-accent);
  font-size: 0.9rem;
  padding: 0;
  margin-bottom: 1rem;
  text-decoration: underline;
}

.product-detail__specs dl {
  display: grid;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--color-surface-elevated);
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.product-detail__specs dt {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.product-detail__buy {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.quantity {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  overflow: hidden;
}

.quantity button {
  width: 2.25rem;
  height: 2.25rem;
  background: var(--color-surface-elevated);
  color: var(--color-text);
  font-size: 1.1rem;
}

.quantity span {
  min-width: 2.5rem;
  text-align: center;
  font-weight: 600;
}

.btn-cart {
  flex: 1;
  min-width: 140px;
  padding: 0.65rem 1.25rem;
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-weight: 600;
  border-radius: 8px;
}

.btn-cart:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cart:hover:not(:disabled) {
  background: var(--color-accent-hover);
}

.btn-fav {
  padding: 0.65rem 1rem;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.btn-fav--active,
.btn-fav:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.product-detail__added {
  margin-top: 0.75rem;
  color: #2d7a4a;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .product-page {
    padding: 1.5rem var(--page-padding-x) 2.5rem;
  }

  .product-detail {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .product-detail h1 {
    font-size: 1.4rem;
  }

  .product-detail__buy {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-cart,
  .btn-fav {
    width: 100%;
    min-width: 0;
  }

  .quantity {
    align-self: flex-start;
  }
}
</style>
