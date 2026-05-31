import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { AUTH_ROUTES, ACCOUNT_ROUTES } from '@/router/routes'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Главная — Musik Shop', zone: 'public' },
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('@/views/CatalogView.vue'),
      meta: { title: 'Каталог — Musik Shop', zone: 'public' },
    },
    {
      path: '/catalog/:id',
      name: 'product',
      component: () => import('@/views/ProductView.vue'),
      meta: { title: 'Товар — Musik Shop', zone: 'public' },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
      meta: { title: 'Корзина — Musik Shop', zone: 'public' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { title: 'О нас — Musik Shop', zone: 'public' },
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchView.vue'),
      meta: { title: 'Поиск — Musik Shop', zone: 'public' },
    },
    {
      path: '/auth',
      component: () => import('@/views/auth/AuthLayout.vue'),
      meta: { guestOnly: true, zone: 'guest' },
      redirect: AUTH_ROUTES.login,
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/LoginView.vue'),
          meta: { title: 'Вход — Musik Shop', zone: 'guest' },
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/auth/RegisterView.vue'),
          meta: { title: 'Регистрация — Musik Shop', zone: 'guest' },
        },
      ],
    },
    {
      path: ACCOUNT_ROUTES.root,
      component: () => import('@/views/profile/ProfileLayout.vue'),
      meta: { requiresAuth: true, zone: 'account' },
      children: [
        {
          path: '',
          name: 'account',
          component: () => import('@/views/profile/ProfileOverview.vue'),
          meta: { title: 'Личный кабинет — Musik Shop', zone: 'account' },
        },
        {
          path: 'orders',
          name: 'account-orders',
          component: () => import('@/views/profile/ProfileOrders.vue'),
          meta: { title: 'Заказы — Musik Shop', zone: 'account' },
        },
        {
          path: 'favorites',
          name: 'account-favorites',
          component: () => import('@/views/profile/ProfileFavorites.vue'),
          meta: { title: 'Избранное — Musik Shop', zone: 'account' },
        },
        {
          path: 'settings',
          name: 'account-settings',
          component: () => import('@/views/profile/ProfileSettings.vue'),
          meta: { title: 'Настройки — Musik Shop', zone: 'account' },
        },
      ],
    },
    {
      path: '/profile',
      redirect: ACCOUNT_ROUTES.root,
    },
    {
      path: '/profile/:rest(.*)',
      redirect: (to) =>
        to.params.rest ? `${ACCOUNT_ROUTES.root}/${to.params.rest}` : ACCOUNT_ROUTES.root,
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
    const redirect =
      typeof to.query.redirect === 'string' && to.query.redirect.startsWith(ACCOUNT_ROUTES.root)
        ? to.query.redirect
        : ACCOUNT_ROUTES.root
    return redirect
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
