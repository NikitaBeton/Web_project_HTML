<script setup>
import { RouterLink } from 'vue-router'
import PageLayout from '@/components/layout/PageLayout.vue'
import { PUBLIC_ROUTES } from '@/router/routes'
</script>

<template>
  <PageLayout>
    <div class="not-found">
      <img
        src="/images/404.jpg"
        alt="Страница не найдена"
        class="not-found__image"
        width="604"
        height="516"
      />

      <div class="not-found__content">
        <p class="not-found__code">404</p>
        <h1 class="not-found__title">Страница не найдена</h1>
        <p class="not-found__text">
          Запрашиваемая страница не существует или была перемещена. Проверьте адрес или вернитесь
          на главную.
        </p>

        <div class="not-found__actions">
          <RouterLink :to="PUBLIC_ROUTES.home" class="not-found__btn not-found__btn--primary">
            На главную
          </RouterLink>
          <RouterLink :to="PUBLIC_ROUTES.catalog" class="not-found__btn not-found__btn--outline">
            В каталог
          </RouterLink>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<style scoped>
.not-found {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 2.5rem var(--page-padding-x) 3.5rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 2.5rem;
  align-items: center;
}

.not-found__image {
  width: 100%;
  max-width: 420px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  justify-self: center;
}

.not-found__code {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1;
  color: var(--color-accent);
  margin-bottom: 0.5rem;
}

.not-found__title {
  font-size: 1.75rem;
  margin-bottom: 0.75rem;
}

.not-found__text {
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 1.75rem;
  max-width: 36ch;
}

.not-found__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.not-found__btn {
  display: inline-flex;
  align-items: center;
  padding: 0.65rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}

.not-found__btn--primary {
  background: var(--color-accent);
  color: var(--color-on-accent);
}

.not-found__btn--primary:hover {
  background: var(--color-accent-hover);
}

.not-found__btn--outline {
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.not-found__btn--outline:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

@media (max-width: 768px) {
  .not-found {
    grid-template-columns: 1fr;
    padding: 2rem var(--page-padding-x) 3rem;
    gap: 1.5rem;
    text-align: center;
  }

  .not-found__text {
    margin-left: auto;
    margin-right: auto;
  }

  .not-found__actions {
    justify-content: center;
  }

  .not-found__code {
    font-size: 3rem;
  }

  .not-found__title {
    font-size: 1.5rem;
  }
}
</style>
