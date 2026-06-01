<script setup>
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import { formatPrice } from '@/utils/formatPrice'
import { useOrdersStore } from '@/stores/orders'
import { PUBLIC_ROUTES } from '@/router/routes'

const ordersStore = useOrdersStore()
const { orders } = storeToRefs(ordersStore)

function formatDate(iso) {
  return new Intl.DateTimeFormat('ru-BY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}
</script>

<template>
  <div class="section">
    <h1>Заказы</h1>
    <p class="section__lead">Текущие заказы и история покупок</p>

    <p v-if="!orders.length" class="empty">
      Заказов пока нет. Оформите покупку в корзине.
    </p>

    <ul v-else class="orders">
      <li v-for="order in orders" :key="order.id" class="order-card">
        <header class="order-card__head">
          <div>
            <p class="order-card__id">Заказ №{{ order.id }}</p>
            <p class="order-card__date">{{ formatDate(order.date) }}</p>
          </div>
          <span class="order-card__status">{{ order.status }}</span>
        </header>

        <ul class="order-card__items">
          <li v-for="item in order.items" :key="item.id">
            <RouterLink :to="PUBLIC_ROUTES.product(item.id)" class="order-card__item-link">
              {{ item.name }}
            </RouterLink>
            × {{ item.quantity }} — {{ formatPrice(item.price * item.quantity) }}
          </li>
        </ul>

        <p class="order-card__total">Итого: {{ formatPrice(order.total) }}</p>

        <p class="order-card__hint">
          Отзывы оставляются на
          <RouterLink :to="PUBLIC_ROUTES.catalog">странице товара</RouterLink>
          в разделе «Отзывы».
        </p>
      </li>
    </ul>
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

.empty {
  color: var(--color-text-muted);
  padding: 2rem;
  text-align: center;
  border: 1px dashed var(--color-border);
  border-radius: 8px;
}

.orders {
  list-style: none;
  display: grid;
  gap: 1rem;
}

.order-card {
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
}

.order-card__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.order-card__id {
  font-weight: 600;
}

.order-card__date {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.order-card__status {
  padding: 0.2rem 0.6rem;
  background: rgba(196, 30, 58, 0.1);
  color: var(--color-accent);
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 4px;
}

.order-card__items {
  list-style: none;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 0.75rem;
}

.order-card__items li {
  margin-bottom: 0.25rem;
}

.order-card__item-link {
  color: var(--color-accent);
  font-weight: 600;
}

.order-card__item-link:hover {
  text-decoration: underline;
}

.order-card__total {
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.order-card__hint {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.order-card__hint a {
  color: var(--color-accent);
  font-weight: 600;
}

@media (max-width: 640px) {
  .order-card__head {
    flex-direction: column;
    gap: 0.5rem;
  }

  .order-card__status {
    align-self: flex-start;
  }
}
</style>
