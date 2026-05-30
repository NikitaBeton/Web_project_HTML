<script setup>
import { ref, onMounted } from 'vue'

const emailNotifications = ref(true)
const orderUpdates = ref(true)
const marketing = ref(false)
const saved = ref(false)

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
</style>
