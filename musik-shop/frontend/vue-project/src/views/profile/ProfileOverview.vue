<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const { user } = storeToRefs(auth)

async function handleLogout() {
  await auth.logout()
  router.push('/')
}
</script>

<template>
  <div class="section">
    <h1>Личный кабинет</h1>
    <p class="section__lead">Здравствуйте, {{ user?.username }}!</p>

    <dl class="info-grid">
      <div>
        <dt>Логин</dt>
        <dd>{{ user?.username }}</dd>
      </div>
      <div>
        <dt>Email</dt>
        <dd>{{ user?.email }}</dd>
      </div>
      <div>
        <dt>ID пользователя</dt>
        <dd>{{ user?.id }}</dd>
      </div>
    </dl>

    <button type="button" class="btn-outline" @click="handleLogout">Выйти из аккаунта</button>
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

.info-grid {
  display: grid;
  gap: 1rem;
  max-width: 400px;
  margin-bottom: 2rem;
}

.info-grid dt {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

.info-grid dd {
  font-size: 1.05rem;
}

.btn-outline {
  padding: 0.6rem 1.25rem;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  font-size: 0.95rem;
}

.btn-outline:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
</style>
