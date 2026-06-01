<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { AUTH_ROUTES } from '@/router/routes'
import {
  fetchProductReviews,
  submitProductReview,
  deleteMyProductReview,
} from '@/api/reviews'

const props = defineProps({
  productId: {
    type: [Number, String],
    required: true,
  },
})

const auth = useAuthStore()
const route = useRoute()
const { isAuthenticated, user } = storeToRefs(auth)

const reviews = ref([])
const summary = ref({ avgRating: null, count: 0 })
const loading = ref(true)
const error = ref('')
const submitting = ref(false)
const formError = ref('')
const formSuccess = ref('')

const rating = ref(5)
const body = ref('')

const myReview = computed(() => reviews.value.find((r) => r.userId === user.value?.id))

function formatDate(iso) {
  return new Intl.DateTimeFormat('ru-BY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

function starsLabel(value) {
  return '★'.repeat(value) + '☆'.repeat(5 - value)
}

async function loadReviews() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await fetchProductReviews(props.productId)
    reviews.value = data.reviews
    summary.value = data.summary
    if (myReview.value) {
      rating.value = myReview.value.rating
      body.value = myReview.value.body ?? ''
    }
  } catch {
    error.value = 'Не удалось загрузить отзывы'
  } finally {
    loading.value = false
  }
}

async function onSubmit() {
  formError.value = ''
  formSuccess.value = ''
  submitting.value = true
  try {
    await submitProductReview(props.productId, {
      rating: rating.value,
      body: body.value.trim() || undefined,
    })
    formSuccess.value = myReview.value ? 'Отзыв обновлён' : 'Спасибо за отзыв!'
    await loadReviews()
  } catch (err) {
    formError.value = err.response?.data?.message ?? 'Не удалось отправить отзыв'
  } finally {
    submitting.value = false
  }
}

async function onDelete() {
  if (!confirm('Удалить ваш отзыв?')) return
  formError.value = ''
  formSuccess.value = ''
  try {
    await deleteMyProductReview(props.productId)
    rating.value = 5
    body.value = ''
    formSuccess.value = 'Отзыв удалён'
    await loadReviews()
  } catch (err) {
    formError.value = err.response?.data?.message ?? 'Не удалось удалить отзыв'
  }
}

watch(
  () => props.productId,
  () => {
    rating.value = 5
    body.value = ''
    loadReviews()
  },
)

onMounted(loadReviews)
</script>

<template>
  <section class="reviews" aria-labelledby="reviews-title">
    <header class="reviews__head">
      <h2 id="reviews-title">Отзывы</h2>
      <p v-if="summary.count" class="reviews__summary">
        <span class="reviews__stars" aria-hidden="true">{{ starsLabel(Math.round(summary.avgRating)) }}</span>
        <span>{{ summary.avgRating }} · {{ summary.count }} {{ summary.count === 1 ? 'отзыв' : summary.count < 5 ? 'отзыва' : 'отзывов' }}</span>
      </p>
      <p v-else-if="!loading" class="reviews__empty-summary">Пока нет отзывов — будьте первым</p>
    </header>

    <p v-if="loading" class="reviews__status">Загрузка отзывов…</p>
    <p v-else-if="error" class="reviews__status reviews__status--error">{{ error }}</p>

    <template v-else>
      <div v-if="isAuthenticated" class="reviews__form">
        <h3>{{ myReview ? 'Изменить отзыв' : 'Оставить отзыв' }}</h3>

        <fieldset class="reviews__rating">
          <legend>Оценка</legend>
          <label v-for="n in 5" :key="n" class="reviews__rating-option">
            <input v-model.number="rating" type="radio" name="rating" :value="n" />
            <span>{{ n }}</span>
          </label>
        </fieldset>

        <label class="reviews__field">
          <span>Комментарий</span>
          <textarea
            v-model="body"
            rows="3"
            maxlength="2000"
            placeholder="Расскажите о качестве, звуке, комплектации…"
          />
        </label>

        <p v-if="formError" class="reviews__message reviews__message--error">{{ formError }}</p>
        <p v-if="formSuccess" class="reviews__message reviews__message--success">{{ formSuccess }}</p>

        <div class="reviews__form-actions">
          <button type="button" class="reviews__submit" :disabled="submitting" @click="onSubmit">
            {{ submitting ? 'Отправка…' : myReview ? 'Сохранить' : 'Отправить отзыв' }}
          </button>
          <button v-if="myReview" type="button" class="reviews__delete" @click="onDelete">
            Удалить
          </button>
        </div>
      </div>

      <p v-else class="reviews__login">
        <RouterLink :to="{ path: AUTH_ROUTES.login, query: { redirect: route.fullPath } }">
          Войдите
        </RouterLink>
        , чтобы оставить отзыв
      </p>

      <ul v-if="reviews.length" class="reviews__list">
        <li v-for="review in reviews" :key="review.id" class="review-card">
          <div class="review-card__head">
            <strong>{{ review.author.username }}</strong>
            <span class="review-card__stars" :aria-label="`Оценка ${review.rating} из 5`">
              {{ starsLabel(review.rating) }}
            </span>
          </div>
          <p v-if="review.body" class="review-card__body">{{ review.body }}</p>
          <time class="review-card__date" :datetime="review.createdAt">{{ formatDate(review.createdAt) }}</time>
        </li>
      </ul>
    </template>
  </section>
</template>

<style scoped>
.reviews {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.reviews__head {
  margin-bottom: 1.5rem;
}

.reviews__head h2 {
  font-size: 1.35rem;
  margin-bottom: 0.35rem;
}

.reviews__summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-muted);
  font-size: 0.95rem;
}

.reviews__stars,
.review-card__stars {
  color: #e6a817;
  letter-spacing: 0.05em;
}

.reviews__empty-summary {
  color: var(--color-text-muted);
  font-size: 0.95rem;
}

.reviews__status {
  color: var(--color-text-muted);
}

.reviews__status--error {
  color: var(--color-accent);
}

.reviews__form {
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.reviews__form h3 {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.reviews__rating {
  border: none;
  padding: 0;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.reviews__rating legend {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-right: 0.25rem;
}

.reviews__rating-option {
  cursor: pointer;
}

.reviews__rating-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.reviews__rating-option span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
}

.reviews__rating-option input:checked + span,
.reviews__rating-option span:hover {
  border-color: var(--color-accent);
  background: rgba(196, 30, 58, 0.08);
  color: var(--color-accent);
  font-weight: 700;
}

.reviews__field {
  display: block;
  margin-bottom: 1rem;
}

.reviews__field span {
  display: block;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 0.35rem;
}

.reviews__field textarea {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-family: inherit;
  resize: vertical;
}

.reviews__message {
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.reviews__message--error {
  color: var(--color-accent);
}

.reviews__message--success {
  color: #2d7a4a;
}

.reviews__form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.reviews__submit {
  padding: 0.55rem 1.1rem;
  background: var(--color-accent);
  color: var(--color-on-accent);
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
}

.reviews__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reviews__delete {
  padding: 0.55rem 1.1rem;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.reviews__delete:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.reviews__login {
  margin-bottom: 1.5rem;
  color: var(--color-text-muted);
}

.reviews__login a {
  color: var(--color-accent);
  font-weight: 600;
}

.reviews__list {
  list-style: none;
  display: grid;
  gap: 1rem;
}

.review-card {
  padding: 1rem 1.1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface-elevated);
}

.review-card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.review-card__body {
  line-height: 1.55;
  margin-bottom: 0.5rem;
}

.review-card__date {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

@media (max-width: 640px) {
  .review-card__head {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
  }
}
</style>
