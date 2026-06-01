<script setup>
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { resetPassword } from '@/api/auth'
import { AUTH_ROUTES } from '@/router/routes'
import { validatePassword } from '@/utils/validatePassword'
import { validateRecoveryKeyword } from '@/utils/validateRecoveryKeyword'

const router = useRouter()

const username = ref('')
const recoveryKeyword = ref('')
const password = ref('')
const passwordConfirm = ref('')
const error = ref('')
const success = ref('')
const submitting = ref(false)

const passwordCheck = computed(() => validatePassword(password.value))
const passwordRules = computed(() => passwordCheck.value.rules)
const showPasswordRules = computed(() => password.value.length > 0)

async function onSubmit() {
  error.value = ''
  success.value = ''

  const keywordCheck = validateRecoveryKeyword(recoveryKeyword.value)
  if (!keywordCheck.valid) {
    error.value = keywordCheck.errors.join('. ')
    return
  }

  if (password.value !== passwordConfirm.value) {
    error.value = 'Пароли не совпадают'
    return
  }

  if (!passwordCheck.value.valid) {
    error.value = passwordCheck.value.errors.join('. ')
    return
  }

  submitting.value = true

  try {
    const { data } = await resetPassword({
      username: username.value.trim(),
      recoveryKeyword: recoveryKeyword.value,
      password: password.value,
    })
    success.value = data.message ?? 'Пароль успешно изменён'
    setTimeout(() => {
      router.push(AUTH_ROUTES.login)
    }, 1500)
  } catch (err) {
    const apiError = err.response?.data
    if (apiError?.errors?.length) {
      error.value = apiError.errors.map((e) => e.message).join('. ')
    } else {
      error.value = apiError?.message ?? 'Не удалось сменить пароль'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <form class="auth-form" @submit.prevent="onSubmit">
    <h1 class="auth-form__title">Восстановление пароля</h1>
    <p class="auth-form__lead">Введите логин, ключевое слово и новый пароль</p>

    <p v-if="error" class="auth-form__error" role="alert">{{ error }}</p>
    <p v-if="success" class="auth-form__success" role="status">{{ success }}</p>

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
      <span>Ключевое слово</span>
      <input
        v-model="recoveryKeyword"
        type="text"
        autocomplete="off"
        required
        minlength="2"
        maxlength="100"
        placeholder="Слово, указанное при регистрации"
      />
    </label>

    <label class="auth-form__field">
      <span>Новый пароль</span>
      <input
        v-model="password"
        type="password"
        autocomplete="new-password"
        required
        minlength="8"
        placeholder="Новый пароль"
      />
      <ul v-if="showPasswordRules" class="auth-form__password-rules" aria-live="polite">
        <li
          v-for="rule in passwordRules"
          :key="rule.id"
          class="auth-form__password-rule"
          :class="{ 'auth-form__password-rule--ok': rule.passed }"
        >
          {{ rule.passed ? '✓' : '○' }} {{ rule.message }}
        </li>
      </ul>
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

    <button type="submit" class="auth-form__submit" :disabled="submitting">
      {{ submitting ? 'Сохранение…' : 'Сменить пароль' }}
    </button>

    <p class="auth-form__switch">
      <RouterLink :to="AUTH_ROUTES.login">Вернуться ко входу</RouterLink>
    </p>
  </form>
</template>

<style scoped>
@import './auth-form.css';

.auth-form__lead {
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin: -0.75rem 0 1.25rem;
}

.auth-form__success {
  padding: 0.6rem 0.75rem;
  margin-bottom: 1rem;
  background: #e8f5ec;
  border: 1px solid #2d7a4a;
  border-radius: 6px;
  color: #1a7f37;
  font-size: 0.9rem;
}

.auth-form__password-rules {
  list-style: none;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.auth-form__password-rule {
  margin-bottom: 0.15rem;
}

.auth-form__password-rule--ok {
  color: #1a7f37;
}
</style>
