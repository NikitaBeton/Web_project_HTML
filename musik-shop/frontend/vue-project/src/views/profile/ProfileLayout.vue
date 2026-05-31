<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { storeToRefs } from 'pinia'
import PageLayout from '@/components/layout/PageLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { ACCOUNT_ROUTES } from '@/router/routes'

const auth = useAuthStore()
const { user } = storeToRefs(auth)

const nav = [
  { to: ACCOUNT_ROUTES.root, label: 'Профиль', exact: true },
  { to: ACCOUNT_ROUTES.orders, label: 'Заказы' },
  { to: ACCOUNT_ROUTES.favorites, label: 'Избранное' },
  { to: ACCOUNT_ROUTES.settings, label: 'Настройки' },
]
</script>

<template>
  <PageLayout>
    <div class="profile-layout">
      <aside class="profile-sidebar">
        <p class="profile-sidebar__user">{{ user?.username }}</p>
        <p class="profile-sidebar__email">{{ user?.email }}</p>
        <nav aria-label="Разделы личного кабинета">
          <RouterLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="profile-sidebar__link"
            active-class="profile-sidebar__link--active"
            :exact-active-class="item.exact ? 'profile-sidebar__link--active' : undefined"
          >
            {{ item.label }}
          </RouterLink>
        </nav>
      </aside>

      <section class="profile-content">
        <RouterView />
      </section>
    </div>
  </PageLayout>
</template>

<style scoped>
.profile-layout {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 2rem;
  align-items: start;
}

.profile-sidebar {
  padding: 1.25rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  position: sticky;
  top: calc(var(--header-height) + 1rem);
}

.profile-sidebar__user {
  font-weight: 700;
  font-size: 1.05rem;
  margin-bottom: 0.25rem;
}

.profile-sidebar__email {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 1.25rem;
  word-break: break-all;
}

.profile-sidebar__link {
  display: block;
  padding: 0.55rem 0.75rem;
  border-radius: 6px;
  color: var(--color-text-muted);
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  transition: background 0.2s, color 0.2s;
}

.profile-sidebar__link:hover {
  color: var(--color-text);
  background: var(--color-surface-elevated);
}

.profile-sidebar__link--active {
  color: var(--color-accent);
  background: rgba(196, 30, 58, 0.08);
  font-weight: 600;
}

.profile-content {
  min-width: 0;
}

@media (max-width: 768px) {
  .profile-layout {
    grid-template-columns: 1fr;
    padding: 1.5rem var(--page-padding-x) 2.5rem;
    gap: 1rem;
  }

  .profile-sidebar {
    position: static;
  }

  .profile-sidebar nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .profile-sidebar__link {
    margin-bottom: 0;
    font-size: 0.9rem;
    padding: 0.5rem 0.65rem;
  }
}
</style>
