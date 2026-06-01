<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { formatPrice } from '@/utils/formatPrice'
import { useCartStore } from '@/stores/cart'
import { useFavoritesStore } from '@/stores/favorites'
import { useAuthStore } from '@/stores/auth'
import { AUTH_ROUTES } from '@/router/routes'

defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const favorites = useFavoritesStore()
const auth = useAuthStore()
const { isAuthenticated } = storeToRefs(auth)

function addToCart(product) {
  cart.add(product)
}

function toggleFavorite(productId) {
  if (!isAuthenticated.value) {
    router.push({
      path: AUTH_ROUTES.login,
      query: { redirect: route.fullPath },
    })
    return
  }
  favorites.toggle(productId)
}
</script>

<template>
  <article class="product-card">
    <RouterLink :to="`/catalog/${product.id}`" class="product-card__link">
      <div class="product-card__image">
        <img
          v-if="product.imageUrl"
          :src="product.imageUrl"
          :alt="product.name"
          class="product-card__img"
          loading="lazy"
        />
        <span v-else class="product-card__placeholder">{{ product.category }}</span>
        <span v-if="product.badge" class="product-card__badge">{{ product.badge }}</span>
      </div>
      <div class="product-card__body">
        <p class="product-card__brand">{{ product.brand }}</p>
        <h3 class="product-card__name">{{ product.name }}</h3>
        <p class="product-card__price">{{ formatPrice(product.price) }}</p>
      </div>
    </RouterLink>
    <div class="product-card__actions">
      <button type="button" class="product-card__btn" @click="addToCart(product)">
        В корзину
      </button>
      <button
        type="button"
        class="product-card__fav"
        :class="{ 'product-card__fav--active': favorites.isFavorite(product.id) }"
        :aria-label="favorites.isFavorite(product.id) ? 'Убрать из избранного' : 'В избранное'"
        @click="toggleFavorite(product.id)"
      >
        ♥
      </button>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.product-card__link {
  flex: 1;
  display: block;
  color: inherit;
}

.product-card__image {
  position: relative;
  aspect-ratio: 4 / 3;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-card__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 0.5rem;
}

.product-card__placeholder {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.product-card__badge {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  padding: 0.2rem 0.55rem;
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 4px;
}

.product-card__body {
  padding: 1rem;
}

.product-card__brand {
  font-size: 0.75rem;
  color: var(--color-accent);
  margin-bottom: 0.25rem;
}

.product-card__name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.product-card__price {
  font-size: 1.15rem;
  font-weight: 700;
}

.product-card__actions {
  display: flex;
  gap: 0.5rem;
  padding: 0 1rem 1rem;
}

.product-card__btn {
  flex: 1;
  padding: 0.55rem;
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  border-radius: 6px;
  font-size: 0.9rem;
  transition: background 0.2s, border-color 0.2s;
}

.product-card__btn:hover {
  border-color: var(--color-accent);
  background: rgba(196, 30, 58, 0.08);
}

.product-card__fav {
  width: 2.5rem;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-muted);
  font-size: 1rem;
  transition: color 0.2s, border-color 0.2s;
}

.product-card__fav--active,
.product-card__fav:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
}
</style>
