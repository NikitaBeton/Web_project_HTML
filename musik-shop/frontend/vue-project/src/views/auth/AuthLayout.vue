<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <RouterLink to="/" class="auth-card__logo">
        <img src="/images/logo.png" alt="" class="auth-card__logo-img" width="40" height="40" />
        Musik Shop
      </RouterLink>

      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.25rem;
  background: linear-gradient(160deg, #ffffff 0%, #fce8ec 100%);
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 2rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(196, 30, 58, 0.08);
}

.auth-card__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-accent);
  margin-bottom: 1.75rem;
}

.auth-card__logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
</style>
