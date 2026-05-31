<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import PageLayout from '@/components/layout/PageLayout.vue'
import { formatPrice } from '@/utils/formatPrice'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'
import { useRouter } from 'vue-router'
import { ACCOUNT_ROUTES } from '@/router/routes'

const cart = useCartStore()
const orders = useOrdersStore()
const router = useRouter()

const isEmpty = computed(() => cart.items.length === 0)

function checkout() {
  if (isEmpty.value) return
  orders.createFromCart(cart.items)
  cart.clear()
  router.push(ACCOUNT_ROUTES.orders)
}
</script>

<template>
  <PageLayout>
    <div class="cart">
      <h1>Корзина</h1>

      <p v-if="isEmpty" class="cart__empty">
        Корзина пуста.
        <RouterLink to="/catalog">Перейти в каталог</RouterLink>
      </p>

      <template v-else>
        <ul class="cart__list">
          <li v-for="item in cart.items" :key="item.id" class="cart-item">
            <img
              v-if="item.imageUrl"
              :src="item.imageUrl"
              :alt="item.name"
              class="cart-item__thumb"
            />
            <div class="cart-item__info">
              <p class="cart-item__name">{{ item.name }}</p>
              <p class="cart-item__brand">{{ item.brand }}</p>
            </div>
            <div class="cart-item__qty">
              <button type="button" @click="cart.setQuantity(item.id, item.quantity - 1)">−</button>
              <span>{{ item.quantity }}</span>
              <button type="button" @click="cart.setQuantity(item.id, item.quantity + 1)">+</button>
            </div>
            <p class="cart-item__price">{{ formatPrice(item.price * item.quantity) }}</p>
            <button type="button" class="cart-item__remove" @click="cart.remove(item.id)">✕</button>
          </li>
        </ul>

        <footer class="cart__footer">
          <p class="cart__total">Итого: {{ formatPrice(cart.totalPrice) }}</p>
          <div class="cart__actions">
            <RouterLink to="/catalog" class="btn-outline">Продолжить покупки</RouterLink>
            <button type="button" class="btn-primary" @click="checkout">Оформить заказ</button>
          </div>
        </footer>
      </template>
    </div>
  </PageLayout>
</template>

<style scoped>
.cart {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;
}

.cart h1 {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
}

.cart__empty {
  color: var(--color-text-muted);
  padding: 2rem;
  text-align: center;
  border: 1px dashed var(--color-border);
  border-radius: 8px;
}

.cart__empty a {
  color: var(--color-accent);
  font-weight: 600;
}

.cart__list {
  list-style: none;
  margin-bottom: 2rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 64px 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
}

.cart-item__thumb {
  width: 64px;
  height: 64px;
  object-fit: contain;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.cart-item__name {
  font-weight: 600;
}

.cart-item__brand {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.cart-item__qty {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  overflow: hidden;
}

.cart-item__qty button {
  width: 2rem;
  height: 2rem;
  background: var(--color-surface-elevated);
}

.cart-item__qty span {
  min-width: 2rem;
  text-align: center;
}

.cart-item__price {
  font-weight: 600;
  min-width: 100px;
  text-align: right;
}

.cart-item__remove {
  background: none;
  color: var(--color-text-muted);
  font-size: 1rem;
}

.cart-item__remove:hover {
  color: var(--color-accent);
}

.cart__total {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cart__actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  flex-direction: column;
}

.cart__actions .btn-outline,
.cart__actions .btn-primary {
  width: 100%;
  text-align: center;
}

.btn-outline {
  padding: 0.65rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
}

.btn-primary {
  padding: 0.65rem 1.5rem;
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-weight: 600;
  border-radius: 8px;
}

@media (min-width: 480px) {
  .cart__actions {
    flex-direction: row;
  }

  .cart__actions .btn-outline,
  .cart__actions .btn-primary {
    width: auto;
  }
}

@media (max-width: 640px) {
  .cart-item {
    grid-template-columns: 56px 1fr auto;
    grid-template-areas:
      'thumb info remove'
      'thumb qty price';
    gap: 0.5rem 0.75rem;
    align-items: center;
  }

  .cart-item__thumb {
    grid-area: thumb;
    width: 56px;
    height: 56px;
  }

  .cart-item__info {
    grid-area: info;
  }

  .cart-item__qty {
    grid-area: qty;
    justify-self: start;
  }

  .cart-item__price {
    grid-area: price;
    min-width: 0;
    font-size: 0.95rem;
  }

  .cart-item__remove {
    grid-area: remove;
    padding: 0.25rem 0.5rem;
    min-width: 2rem;
    min-height: 2rem;
  }
}
</style>
