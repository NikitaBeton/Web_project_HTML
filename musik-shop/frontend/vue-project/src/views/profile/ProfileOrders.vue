<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { formatPrice } from '@/utils/formatPrice'
import { useOrdersStore } from '@/stores/orders'

const ordersStore = useOrdersStore()
const { orders } = storeToRefs(ordersStore)

const reviewTexts = ref({})

function formatDate(iso) {
  return new Intl.DateTimeFormat('ru-BY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

function submitReview(orderId) {
  const text = reviewTexts.value[orderId]?.trim()
  if (!text) return
  ordersStore.addReview(orderId, text)
  reviewTexts.value[orderId] = ''
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
            {{ item.name }} × {{ item.quantity }} — {{ formatPrice(item.price * item.quantity) }}
          </li>
        </ul>

        <p class="order-card__total">Итого: {{ formatPrice(order.total) }}</p>

        <div v-if="order.review" class="order-card__review">
          <p class="order-card__review-text">
            <strong>Ваш отзыв:</strong> {{ order.review }}
          </p>
        </div>
        <div v-else class="order-card__review">
          <label>
            <span>Оставить отзыв</span>
            <textarea
              v-model="reviewTexts[order.id]"
              rows="2"
              placeholder="Расскажите о товаре…"
            />
          </label>
          <button type="button" class="btn-sm" @click="submitReview(order.id)">Отправить</button>
        </div>
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

.order-card__total {
  font-weight: 700;
  margin-bottom: 1rem;
}

.order-card__review label {
  display: block;
  margin-bottom: 0.5rem;
}

.order-card__review span {
  display: block;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 0.35rem;
}

.order-card__review textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-family: inherit;
  resize: vertical;
}

.order-card__review-text {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.btn-sm {
  padding: 0.4rem 0.85rem;
  background: var(--color-accent);
  color: var(--color-on-accent);
  border-radius: 6px;
  font-size: 0.85rem;
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
