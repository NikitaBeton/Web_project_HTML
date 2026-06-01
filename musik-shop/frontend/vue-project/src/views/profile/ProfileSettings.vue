<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { updateRecoveryKeyword } from '@/api/account'
import { validateRecoveryKeyword } from '@/utils/validateRecoveryKeyword'

const auth = useAuthStore()
const { user } = storeToRefs(auth)

const emailNotifications = ref(true)
const orderUpdates = ref(true)
const marketing = ref(false)
const saved = ref(false)

const recoveryPassword = ref('')
const currentRecoveryKeyword = ref('')
const recoveryKeyword = ref('')
const recoveryKeywordConfirm = ref('')
const recoveryError = ref('')
const recoverySuccess = ref('')
const recoverySubmitting = ref(false)

onMounted(() => {
  try {
    const stored = JSON.parse(localStorage.getItem('musik_shop_settings'))
    if (stored) {
      emailNotifications.value = stored.emailNotifications ?? true
      orderUpdates.value = stored.orderUpdates ?? true
      marketing.value = stored.marketing ?? false
    }
  } catch { /* defaults */ }
})

function saveSettings() {
  localStorage.setItem(
    'musik_shop_settings',
    JSON.stringify({
      emailNotifications: emailNotifications.value,
      orderUpdates: orderUpdates.value,
      marketing: marketing.value,
    }),
  )
  saved.value = true
  setTimeout(() => { saved.value = false }, 2000)
}

async function saveRecoveryKeyword() {
  recoveryError.value = ''
  recoverySuccess.value = ''

  const keywordCheck = validateRecoveryKeyword(recoveryKeyword.value)
  if (!keywordCheck.valid) {
    recoveryError.value = keywordCheck.errors.join('. ')
    return
  }

  if (recoveryKeyword.value !== recoveryKeywordConfirm.value) {
    recoveryError.value = 'Ключевые слова не совпадают'
    return
  }

  if (!recoveryPassword.value) {
    recoveryError.value = 'Введите текущий пароль'
    return
  }

  if (user.value?.hasRecoveryKeyword && !currentRecoveryKeyword.value) {
    recoveryError.value = 'Укажите текущее ключевое слово'
    return
  }

  recoverySubmitting.value = true

  try {
    const { data } = await updateRecoveryKeyword({
      password: recoveryPassword.value,
      recoveryKeyword: recoveryKeyword.value,
      currentRecoveryKeyword: user.value?.hasRecoveryKeyword
        ? currentRecoveryKeyword.value
        : undefined,
    })
    recoverySuccess.value = data.message ?? 'Ключевое слово сохранено'
    recoveryPassword.value = ''
    currentRecoveryKeyword.value = ''
    recoveryKeyword.value = ''
    recoveryKeywordConfirm.value = ''
    if (user.value) {
      user.value.hasRecoveryKeyword = true
    }
  } catch (err) {
    recoveryError.value = err.response?.data?.message ?? 'Не удалось сохранить ключевое слово'
  } finally {
    recoverySubmitting.value = false
  }
}
</script>

<template>
  <div class="section">
    <h1>Настройки</h1>
    <p class="section__lead">Уведомления и конфиденциальность</p>

    <form class="settings" @submit.prevent="saveSettings">
      <label class="setting">
        <input v-model="emailNotifications" type="checkbox" />
        <span>Email-уведомления о заказах</span>
      </label>

      <label class="setting">
        <input v-model="orderUpdates" type="checkbox" />
        <span>SMS о статусе доставки</span>
      </label>

      <label class="setting">
        <input v-model="marketing" type="checkbox" />
        <span>Рассылка акций и новинок</span>
      </label>

      <button type="submit" class="btn-save">Сохранить</button>
      <p v-if="saved" class="saved-msg">Настройки сохранены</p>
    </form>

    <section class="recovery" aria-labelledby="recovery-title">
      <h2 id="recovery-title">Восстановление пароля</h2>
      <p class="recovery__lead">
        <template v-if="user?.hasRecoveryKeyword">
          Ключевое слово задано. Чтобы изменить его, укажите текущее и новое.
        </template>
        <template v-else>
          Задайте ключевое слово — оно понадобится для сброса пароля на странице входа.
        </template>
      </p>

      <form class="recovery__form" @submit.prevent="saveRecoveryKeyword">
        <p v-if="recoveryError" class="recovery__error" role="alert">{{ recoveryError }}</p>
        <p v-if="recoverySuccess" class="recovery__success" role="status">{{ recoverySuccess }}</p>

        <label v-if="user?.hasRecoveryKeyword" class="recovery__field">
          <span>Текущее ключевое слово</span>
          <input
            v-model="currentRecoveryKeyword"
            type="text"
            autocomplete="off"
            required
          />
        </label>

        <label class="recovery__field">
          <span>{{ user?.hasRecoveryKeyword ? 'Новое ключевое слово' : 'Ключевое слово' }}</span>
          <input
            v-model="recoveryKeyword"
            type="text"
            autocomplete="off"
            required
            minlength="2"
            maxlength="100"
          />
        </label>

        <label class="recovery__field">
          <span>Подтверждение ключевого слова</span>
          <input
            v-model="recoveryKeywordConfirm"
            type="text"
            autocomplete="off"
            required
            minlength="2"
            maxlength="100"
          />
        </label>

        <label class="recovery__field">
          <span>Текущий пароль</span>
          <input
            v-model="recoveryPassword"
            type="password"
            autocomplete="current-password"
            required
          />
        </label>

        <button type="submit" class="btn-save" :disabled="recoverySubmitting">
          {{ recoverySubmitting ? 'Сохранение…' : 'Сохранить ключевое слово' }}
        </button>
      </form>
    </section>
  </div>
</template>

<style scoped>
.section h1 {
  font-size: 1.5rem;
  margin-bottom: 0.35rem;
}

.section__lead {
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
}

.settings {
  max-width: 400px;
}

.setting {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
}

.setting input {
  width: 1.1rem;
  height: 1.1rem;
  accent-color: var(--color-accent);
}

.btn-save {
  margin-top: 1.25rem;
  padding: 0.65rem 1.5rem;
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-weight: 600;
  border-radius: 8px;
}

.saved-msg {
  margin-top: 0.75rem;
  color: #2d7a4a;
  font-size: 0.9rem;
}

.recovery {
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
  max-width: 400px;
}

.recovery h2 {
  font-size: 1.15rem;
  margin-bottom: 0.35rem;
}

.recovery__lead {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
}

.recovery__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.recovery__field span {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.recovery__field input {
  padding: 0.55rem 0.65rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg);
  color: var(--color-text);
}

.recovery__error {
  padding: 0.6rem 0.75rem;
  margin-bottom: 1rem;
  background: #fce8ec;
  border: 1px solid var(--color-accent);
  border-radius: 6px;
  color: var(--color-accent);
  font-size: 0.9rem;
}

.recovery__success {
  padding: 0.6rem 0.75rem;
  margin-bottom: 1rem;
  background: #e8f5ec;
  border: 1px solid #2d7a4a;
  border-radius: 6px;
  color: #1a7f37;
  font-size: 0.9rem;
}
</style>
