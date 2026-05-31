<script setup>
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { AUTH_ROUTES } from '@/router/routes'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)

async function onSubmit() {
  error.value = ''
  submitting.value = true

  try {
    await auth.login({ username: username.value.trim(), password: password.value })
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.push(redirect)
  } catch (err) {
    error.value = err.response?.data?.message ?? 'Не удалось войти. Проверьте данные.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <form class="auth-form" @submit.prevent="onSubmit">
    <h1 class="auth-form__title">Вход</h1>

    <p v-if="error" class="auth-form__error" role="alert">{{ error }}</p>

    <label class="auth-form__field">
      <span>Логин</span>
      <input
        v-model="username"
        type="text"
        autocomplete="username"
        required
        minlength="2"
        placeholder="Ваш логин"
      />
    </label>

    <label class="auth-form__field">
      <span>Пароль</span>
      <input
        v-model="password"
        type="password"
        autocomplete="current-password"
        required
        placeholder="••••••••"
      />
    </label>

    <button type="submit" class="auth-form__submit" :disabled="submitting || auth.loading">
      {{ submitting ? 'Вход…' : 'Войти' }}
    </button>

    <p class="auth-form__switch">
      Нет аккаунта?
      <RouterLink :to="AUTH_ROUTES.register">Зарегистрироваться</RouterLink>
    </p>
  </form>
</template>

<style scoped>
@import './auth-form.css';
</style>
