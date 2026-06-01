import api from '@/api/client'

export function fetchProductReviews(productId) {
  return api.get(`/products/${productId}/reviews`)
}

export function submitProductReview(productId, { rating, body }) {
  return api.post(`/products/${productId}/reviews`, { rating, body })
}

export function deleteMyProductReview(productId) {
  return api.delete(`/products/${productId}/reviews/mine`)
}
