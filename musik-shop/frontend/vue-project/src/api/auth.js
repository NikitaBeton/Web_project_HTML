import api from './client'

export function checkEmail(email) {
  return api.get('/auth/check-email', { params: { email } })
}

export function register(payload) {
  return api.post('/auth/register', payload)
}

export function login(payload) {
  return api.post('/auth/login', payload)
}

export function logout() {
  return api.post('/auth/logout')
}

export function fetchMe() {
  return api.get('/auth/me')
}
