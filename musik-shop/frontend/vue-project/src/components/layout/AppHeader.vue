<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { AUTH_ROUTES, ACCOUNT_ROUTES, routeRequiresAuth } from '@/router/routes'

const route = useRoute()
const router = useRouter()
const searchQuery = ref('')
const menuOpen = ref(false)
const auth = useAuthStore()
const cart = useCartStore()
const { isAuthenticated, user } = storeToRefs(auth)
const { totalItems } = storeToRefs(cart)

function onSearch() {
  const q = searchQuery.value.trim()
  menuOpen.value = false
  router.push({ path: '/search', query: q ? { q } : {} })
}

function closeMenu() {
  menuOpen.value = false
}

async function handleLogout() {
  menuOpen.value = false
  await auth.logout()
  if (route.meta.requiresAuth || routeRequiresAuth(route.matched)) {
    await router.push(AUTH_ROUTES.login)
  }
}

watch(
  () => route.path,
  () => {
    menuOpen.value = false
  },
)

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
        <span class="header__logo-text">Musik Shop</span>
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
          placeholder="Поиск…"
          class="header__search-input"
        />
        <button type="submit" class="header__search-btn" aria-label="Искать">⌕</button>
      </form>

      <div class="header__actions">
        <RouterLink to="/cart" class="header__cart" aria-label="Корзина">
          🛒
          <span v-if="totalItems" class="header__cart-badge">{{ totalItems }}</span>
        </RouterLink>

        <div v-if="isAuthenticated" class="header__user-block">
          <RouterLink :to="ACCOUNT_ROUTES.root" class="header__user" :title="user?.email">
            {{ user?.username }}
          </RouterLink>
          <button type="button" class="header__logout" @click="handleLogout">Выйти</button>
        </div>
        <RouterLink v-else :to="AUTH_ROUTES.login" class="header__auth">Войти</RouterLink>

        <button
          type="button"
          class="header__burger"
          :aria-expanded="menuOpen"
          aria-controls="header-mobile-menu"
          aria-label="Меню"
          @click="menuOpen = !menuOpen"
        >
          <span class="header__burger-line" :class="{ 'header__burger-line--open': menuOpen }" />
          <span class="header__burger-line" :class="{ 'header__burger-line--open': menuOpen }" />
          <span class="header__burger-line" :class="{ 'header__burger-line--open': menuOpen }" />
        </button>
      </div>
    </div>

    <nav
      id="header-mobile-menu"
      class="header__mobile-nav"
      :class="{ 'header__mobile-nav--open': menuOpen }"
      aria-label="Мобильная навигация"
    >
      <RouterLink to="/catalog" class="header__mobile-link" @click="closeMenu">Каталог</RouterLink>
      <RouterLink to="/about" class="header__mobile-link" @click="closeMenu">О нас</RouterLink>
      <RouterLink to="/search" class="header__mobile-link" @click="closeMenu">Поиск</RouterLink>
      <template v-if="isAuthenticated">
        <RouterLink
          :to="ACCOUNT_ROUTES.root"
          class="header__mobile-link header__mobile-link--accent"
          @click="closeMenu"
        >
          {{ user?.username }}
        </RouterLink>
        <button
          type="button"
          class="header__mobile-link header__mobile-logout"
          @click="handleLogout"
        >
          Выйти
        </button>
      </template>
      <RouterLink
        v-else
        :to="AUTH_ROUTES.login"
        class="header__mobile-link header__mobile-link--accent"
        @click="closeMenu"
      >
        Войти
      </RouterLink>
    </nav>
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
  padding: 0 var(--page-padding-x);
  height: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header__logo {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--color-accent);
  white-space: nowrap;
  flex-shrink: 0;
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
  flex-shrink: 0;
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
  min-width: 0;
}

.header__search-input {
  flex: 1;
  min-width: 0;
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
  flex-shrink: 0;
}

.header__search-btn:hover {
  color: var(--color-accent);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.header__cart {
  position: relative;
  font-size: 1.25rem;
  padding: 0.35rem;
  line-height: 1;
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

.header__user-block {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.header__user {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--color-text);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header__user:hover {
  color: var(--color-accent);
}

.header__logout {
  padding: 0.45rem 0.85rem;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  transition: border-color 0.2s, color 0.2s;
}

.header__logout:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.header__burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.5rem;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 6px;
}

.header__burger-line {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--color-text);
  border-radius: 1px;
  transition: transform 0.2s, opacity 0.2s;
}

.header__burger-line:nth-child(1).header__burger-line--open {
  transform: translateY(7px) rotate(45deg);
}

.header__burger-line:nth-child(2).header__burger-line--open {
  opacity: 0;
}

.header__burger-line:nth-child(3).header__burger-line--open {
  transform: translateY(-7px) rotate(-45deg);
}

.header__mobile-nav {
  display: none;
  flex-direction: column;
  padding: 0 var(--page-padding-x);
  max-height: 0;
  overflow: hidden;
  background: var(--color-surface);
  border-bottom: 1px solid transparent;
  transition: max-height 0.25s ease, padding 0.25s ease, border-color 0.25s ease;
}

.header__mobile-nav--open {
  max-height: 320px;
  padding: 0.75rem var(--page-padding-x) 1rem;
  border-bottom-color: var(--color-border);
}

.header__mobile-link {
  display: block;
  padding: 0.75rem 0;
  color: var(--color-text);
  font-size: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.header__mobile-link:last-child {
  border-bottom: none;
}

.header__mobile-link--accent {
  color: var(--color-accent);
  font-weight: 600;
}

.header__mobile-logout {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.75rem 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 1rem;
  cursor: pointer;
}

.header__mobile-logout:hover {
  color: var(--color-accent);
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
  .header {
    height: auto;
    min-height: var(--header-height);
  }

  .header__inner {
    flex-wrap: wrap;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    gap: 0.5rem 0.75rem;
  }

  .header__nav {
    display: none;
  }

  .header__search {
    order: 3;
    flex: 1 1 100%;
    max-width: none;
    margin-left: 0;
  }

  .header__user-block {
    display: none;
  }

  .header__auth {
    display: inline-flex;
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
  }

  .header__burger {
    display: flex;
  }

  .header__mobile-nav {
    display: flex;
  }
}

@media (max-width: 480px) {
  .header__logo-text {
    display: none;
  }

  .header__logo-img {
    width: 32px;
    height: 32px;
  }
}
</style>
