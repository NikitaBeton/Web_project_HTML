import api from './client'

export function fetchProducts(params = {}) {
  return api.get('/products', { params })
}

export function fetchProduct(id) {
  return api.get(`/products/${id}`)
}

export function fetchFilters() {
  return api.get('/products/filters')
}
