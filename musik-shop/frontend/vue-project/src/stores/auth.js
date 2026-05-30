import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TOKEN_KEY } from '@/api/client'
import * as authApi from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem(TOKEN_KEY))
  const loading = ref(false)
  const initialized = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value && user.value))

  function setSession(newToken, newUser) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem(TOKEN_KEY, newToken)
  }

  function clearSession() {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  async function init() {
    if (!token.value) {
      initialized.value = true
      return
    }

    loading.value = true
    try {
      const { data } = await authApi.fetchMe()
      user.value = data.user
    } catch {
      clearSession()
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  async function register({ email, username, password }) {
    loading.value = true
    try {
      const { data } = await authApi.register({ email, username, password })
      setSession(data.token, data.user)
      return data
    } finally {
      loading.value = false
    }
  }

  async function login({ username, password }) {
    loading.value = true
    try {
      const { data } = await authApi.login({ username, password })
      setSession(data.token, data.user)
      return data
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch {
      /* выход на клиенте в любом случае */
    }
    clearSession()
  }

  return {
    user,
    token,
    loading,
    initialized,
    isAuthenticated,
    init,
    register,
    login,
    logout,
    clearSession,
  }
})
