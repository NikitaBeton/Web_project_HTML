const API_PREFIX = '/api'

const API_ROUTES = {
  health: `${API_PREFIX}/health`,
  auth: {
    base: `${API_PREFIX}/auth`,
    register: `${API_PREFIX}/auth/register`,
    login: `${API_PREFIX}/auth/login`,
    logout: `${API_PREFIX}/auth/logout`,
    checkEmail: `${API_PREFIX}/auth/check-email`,
  },
  account: {
    base: `${API_PREFIX}/account`,
    me: `${API_PREFIX}/account/me`,
  },
  products: {
    base: `${API_PREFIX}/products`,
    list: `${API_PREFIX}/products`,
    one: (id) => `${API_PREFIX}/products/${id}`,
    filters: `${API_PREFIX}/products/filters`,
    reviews: (id) => `${API_PREFIX}/products/${id}/reviews`,
  },
}

module.exports = { API_PREFIX, API_ROUTES }
