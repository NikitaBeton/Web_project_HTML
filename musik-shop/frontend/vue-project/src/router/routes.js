/** Публичные маршруты — доступны всем */
export const PUBLIC_ROUTES = {
  home: '/',
  catalog: '/catalog',
  product: (id) => `/catalog/${id}`,
  cart: '/cart',
  about: '/about',
  search: '/search',
}

/** Гостевые маршруты — только для неавторизованных */
export const AUTH_ROUTES = {
  login: '/auth/login',
  register: '/auth/register',
}

/** Приватная зона — только для авторизованных */
export const ACCOUNT_ROUTES = {
  root: '/account',
  orders: '/account/orders',
  favorites: '/account/favorites',
  settings: '/account/settings',
}

/** @deprecated используйте ACCOUNT_ROUTES */
export const LEGACY_PROFILE_PREFIX = '/profile'
