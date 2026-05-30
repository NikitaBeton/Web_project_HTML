<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const searchQuery = ref('')
const auth = useAuthStore()
const cart = useCartStore()
const { isAuthenticated, user } = storeToRefs(auth)
const { totalItems } = storeToRefs(cart)

function onSearch() {
  const q = searchQuery.value.trim()
  router.push({ path: '/search', query: q ? { q } : {} })
}

watch(
  () => route.query.q,
  (q) => {
    if (route.path === '/search' || route.path === '/catalog') {
      searchQuery.value = (q ?? '') || ''
    }
  },
  { immediate: true },
)
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <RouterLink to="/" class="header__logo">
        <img src="/images/logo.png" alt="" class="header__logo-img" width="36" height="36" />
        Musik Shop
      </RouterLink>

      <nav class="header__nav" aria-label="Основная навигация">
        <RouterLink to="/catalog" class="header__link">Каталог</RouterLink>
        <RouterLink to="/about" class="header__link">О нас</RouterLink>
      </nav>

      <form class="header__search" role="search" @submit.prevent="onSearch">
        <label for="header-search" class="visually-hidden">Поиск товаров</label>
        <input
          id="header-search"
          v-model="searchQuery"
          type="search"
          placeholder="Поиск инструментов…"
          class="header__search-input"
        />
        <button type="submit" class="header__search-btn" aria-label="Искать">⌕</button>
      </form>

      <RouterLink to="/cart" class="header__cart" aria-label="Корзина">
        🛒
        <span v-if="totalItems" class="header__cart-badge">{{ totalItems }}</span>
      </RouterLink>

      <RouterLink
        :to="isAuthenticated ? '/profile' : '/auth/login'"
        class="header__auth"
      >
        {{ isAuthenticated ? user?.username : 'Вход / Регистрация' }}
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-height);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
}

.header__inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1.25rem;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.header__logo {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--color-accent);
  white-space: nowrap;
}

.header__logo-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  flex-shrink: 0;
}

.header__nav {
  display: flex;
  gap: 1.25rem;
}

.header__link {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  transition: color 0.2s;
}

.header__link:hover,
.header__link.router-link-active {
  color: var(--color-text);
}

.header__search {
  flex: 1;
  max-width: 320px;
  display: flex;
  margin-left: auto;
}

.header__search-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-right: none;
  border-radius: 6px 0 0 6px;
  color: var(--color-text);
  font-size: 0.9rem;
}

.header__search-input::placeholder {
  color: var(--color-text-muted);
}

.header__search-input:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: -1px;
}

.header__search-btn {
  padding: 0 0.85rem;
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: 0 6px 6px 0;
  color: var(--color-text-muted);
  font-size: 1.1rem;
}

.header__search-btn:hover {
  color: var(--color-accent);
}

.header__cart {
  position: relative;
  font-size: 1.25rem;
  padding: 0.25rem;
}

.header__cart-badge {
  position: absolute;
  top: -4px;
  right: -6px;
  min-width: 1.1rem;
  height: 1.1rem;
  padding: 0 0.25rem;
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header__auth {
  padding: 0.45rem 1rem;
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-weight: 600;
  font-size: 0.85rem;
  border-radius: 6px;
  white-space: nowrap;
  transition: background 0.2s;
}

.header__auth:hover {
  background: var(--color-accent-hover);
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

@media (max-width: 768px) {
  .header__nav {
    display: none;
  }

  .header__search {
    max-width: 120px;
  }

  .header__auth {
    font-size: 0.75rem;
    padding: 0.4rem 0.6rem;
  }
}
</style>
