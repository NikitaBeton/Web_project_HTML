import api from './client'

export function fetchMe() {
  return api.get('/account/me')
}

export function updateRecoveryKeyword(payload) {
  return api.put('/account/recovery-keyword', payload)
}
