<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { checkEmail } from '@/api/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const username = ref('')
const password = ref('')
const passwordConfirm = ref('')
const error = ref('')
const emailHint = ref('')
const submitting = ref(false)
let emailCheckTimer = null

function onEmailInput() {
  emailHint.value = ''
  clearTimeout(emailCheckTimer)

  if (!email.value.includes('@')) return

  emailCheckTimer = setTimeout(async () => {
    try {
      const { data } = await checkEmail(email.value.trim())
      emailHint.value = data.available ? 'Email свободен' : 'Этот email уже занят'
    } catch {
      emailHint.value = ''
    }
  }, 400)
}

async function onSubmit() {
  error.value = ''

  if (password.value !== passwordConfirm.value) {
    error.value = 'Пароли не совпадают'
    return
  }

  submitting.value = true

  try {
    await auth.register({
      email: email.value.trim(),
      username: username.value.trim(),
      password: password.value,
    })
    await router.push('/')
  } catch (err) {
    const apiError = err.response?.data
    if (apiError?.errors?.length) {
      error.value = apiError.errors.map((e) => e.message).join('. ')
    } else {
      error.value = apiError?.message ?? 'Не удалось зарегистрироваться'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <form class="auth-form" @submit.prevent="onSubmit">
    <h1 class="auth-form__title">Регистрация</h1>

    <p v-if="error" class="auth-form__error" role="alert">{{ error }}</p>

    <label class="auth-form__field">
      <span>Логин</span>
      <input
        v-model="username"
        type="text"
        autocomplete="username"
        required
        minlength="2"
        maxlength="100"
        placeholder="Придумайте логин"
      />
    </label>

    <label class="auth-form__field">
      <span>Email</span>
      <input
        v-model="email"
        type="email"
        autocomplete="email"
        required
        placeholder="you@example.com"
        @input="onEmailInput"
      />
      <small
        v-if="emailHint"
        class="auth-form__hint"
        :class="{ 'auth-form__hint--bad': emailHint.includes('занят') }"
      >
        {{ emailHint }}
      </small>
    </label>

    <label class="auth-form__field">
      <span>Пароль</span>
      <input
        v-model="password"
        type="password"
        autocomplete="new-password"
        required
        minlength="6"
        placeholder="Минимум 6 символов"
      />
    </label>

    <label class="auth-form__field">
      <span>Подтверждение пароля</span>
      <input
        v-model="passwordConfirm"
        type="password"
        autocomplete="new-password"
        required
        placeholder="Повторите пароль"
      />
    </label>

    <button type="submit" class="auth-form__submit" :disabled="submitting || auth.loading">
      {{ submitting ? 'Регистрация…' : 'Зарегистрироваться' }}
    </button>

    <p class="auth-form__switch">
      Уже есть аккаунт?
      <RouterLink to="/auth/login">Войти</RouterLink>
    </p>
  </form>
</template>

<style scoped>
@import './auth-form.css';
</style>
