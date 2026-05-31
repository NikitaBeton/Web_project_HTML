/** Публичные маршруты — доступны всем без авторизации */
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

/** Приватная зона — только для авторизованных (минимум 3 раздела) */
export const ACCOUNT_ROUTES = {
  root: '/account',
  orders: '/account/orders',
  favorites: '/account/favorites',
  settings: '/account/settings',
}

/** Имена приватных маршрутов для guard и документации */
export const PRIVATE_ROUTE_NAMES = [
  'account',
  'account-orders',
  'account-favorites',
  'account-settings',
]

/** @deprecated используйте ACCOUNT_ROUTES */
export const LEGACY_PROFILE_PREFIX = '/profile'

/** Проверка, требует ли маршрут авторизации (по meta matched-записей) */
export function routeRequiresAuth(matched) {
  return matched.some((record) => record.meta.requiresAuth)
}
