import api from './client'

export function fetchMe() {
  return api.get('/account/me')
}
