import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Главная — Musik Shop' },
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('@/views/CatalogView.vue'),
      meta: { title: 'Каталог — Musik Shop' },
    },
    {
      path: '/catalog/:id',
      name: 'product',
      component: () => import('@/views/ProductView.vue'),
      meta: { title: 'Товар — Musik Shop' },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
      meta: { title: 'Корзина — Musik Shop' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { title: 'О нас — Musik Shop' },
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchView.vue'),
      meta: { title: 'Поиск — Musik Shop' },
    },
    {
      path: '/auth',
      component: () => import('@/views/auth/AuthLayout.vue'),
      meta: { guestOnly: true },
      redirect: '/auth/login',
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/LoginView.vue'),
          meta: { title: 'Вход — Musik Shop' },
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/auth/RegisterView.vue'),
          meta: { title: 'Регистрация — Musik Shop' },
        },
      ],
    },
    {
      path: '/profile',
      component: () => import('@/views/profile/ProfileLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'profile',
          component: () => import('@/views/profile/ProfileOverview.vue'),
          meta: { title: 'Личный кабинет — Musik Shop' },
        },
        {
          path: 'orders',
          name: 'profile-orders',
          component: () => import('@/views/profile/ProfileOrders.vue'),
          meta: { title: 'Заказы — Musik Shop' },
        },
        {
          path: 'favorites',
          name: 'profile-favorites',
          component: () => import('@/views/profile/ProfileFavorites.vue'),
          meta: { title: 'Избранное — Musik Shop' },
        },
        {
          path: 'settings',
          name: 'profile-settings',
          component: () => import('@/views/profile/ProfileSettings.vue'),
          meta: { title: 'Настройки — Musik Shop' },
        },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.initialized) {
    await auth.init()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.matched.some((r) => r.meta.guestOnly) && auth.isAuthenticated) {
    return { path: '/' }
  }
})

router.afterEach((to) => {
  const title = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta.title)?.meta.title
  document.title = title ?? 'Musik Shop'
})

export default router
